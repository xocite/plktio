#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <inttypes.h>


static const unsigned long SQUARE_ROOT_256[8] = {
  0x6a09e667UL, 0xbb67ae85UL, 0x3c6ef372UL, 0xa54ff53aUL, 
  0x510e527fUL, 0x9b05688cUL, 0x1f83d9abUL, 0x5be0cd19UL
};

static const unsigned long CUBE_ROOT_256[64] = {
  0x428a2f98UL, 0x71374491UL, 0xb5c0fbcfUL, 0xe9b5dba5UL,
  0x3956c25bUL, 0x59f111f1UL, 0x923f82a4UL, 0xab1c5ed5UL,
  0xd807aa98UL, 0x12835b01UL, 0x243185beUL, 0x550c7dc3UL,
  0x72be5d74UL, 0x80deb1feUL, 0x9bdc06a7UL, 0xc19bf174UL,
  0xe49b69c1UL, 0xefbe4786UL, 0x0fc19dc6UL, 0x240ca1ccUL,
  0x2de92c6fUL, 0x4a7484aaUL, 0x5cb0a9dcUL, 0x76f988daUL,
  0x983e5152UL, 0xa831c66dUL, 0xb00327c8UL, 0xbf597fc7UL,
  0xc6e00bf3UL, 0xd5a79147UL, 0x06ca6351UL, 0x14292967UL,
  0x27b70a85UL, 0x2e1b2138UL, 0x4d2c6dfcUL, 0x53380d13UL,
  0x650a7354UL, 0x766a0abbUL, 0x81c2c92eUL, 0x92722c85UL,
  0xa2bfe8a1UL, 0xa81a664bUL, 0xc24b8b70UL, 0xc76c51a3UL,
  0xd192e819UL, 0xd6990624UL, 0xf40e3585UL, 0x106aa070UL,
  0x19a4c116UL, 0x1e376c08UL, 0x2748774cUL, 0x34b0bcb5UL,
  0x391c0cb3UL, 0x4ed8aa4aUL, 0x5b9cca4fUL, 0x682e6ff3UL,
  0x748f82eeUL, 0x78a5636fUL, 0x84c87814UL, 0x8cc70208UL,
  0x90befffaUL, 0xa4506cebUL, 0xbef9a3f7UL, 0xc67178f2UL
};

#define rotate_right(x, n)    (((x) >> (n)) | ((x) << (32 - (n))))
#define hash_sigma_0(x)       (rotate_right((x), 7) ^ rotate_right((x), 18) ^ ((x) >> 3))
#define hash_sigma_1(x)       (rotate_right((x), 17) ^ rotate_right((x), 19) ^ ((x) >> 10))
#define hash_sum_0(x)         (rotate_right((x), 2) ^ rotate_right((x), 13) ^ rotate_right((x), 22))
#define hash_sum_1(x)         (rotate_right((x), 6) ^ rotate_right((x), 11) ^ (rotate_right((x), 25)))
#define hash_maj(x, y, z)     (((x) & (y)) ^ ((x) & (z)) ^ ((y) & (z)))
#define hash_ch(x, y, z)      (((x) & (y)) ^ ((~x) & (z)))

struct message_block {
  uint32_t block[16];
  struct message_block * next;
  uint8_t position;
};

struct message_schedule {
  uint32_t block[64];
  struct message_schedule * next;
};

struct message_block * new_message_block(void) {
  struct message_block * m = calloc(1, sizeof *m);
  m->next = NULL;
  return m;
}

void free_message_block(struct message_block *m) {
  if (m == NULL) return;
  free_message_block(m->next);
  free(m);
}

struct message_schedule * new_message_schedule(void) {
  struct message_schedule * m = calloc(1, sizeof *m);
  m->next = NULL;
  return m;
}

void free_message_schedule(struct message_schedule *m) {
  if (m == NULL) return;
  free_message_schedule(m->next);
  free(m);
}

struct hash {
  uint32_t value[8];
};

struct message_block * pad_message(const char *input) {
  size_t len = 0;
  uint32_t * blk;
  uint16_t remainder;
  char ch;
  struct message_block *head, *p;
  head = new_message_block();

  p = head;

  // Determine how many message blocks we need.
  // We need [data][1 bit][zero padding][length]
  // [data] maximum length 447 bits
  // [1 bit] length = 1 bit
  // [zero padding] maximum length 447 bits
  // [length] 64 bits

  if (input == NULL) {
    head->block[0] = 1u << 31;
    return head;
  }
  
  while (*(input + len) != '\0') {
    len++; // we have one character
    blk = &p->block[p->position];
    ch = *(input + len - 1);

    switch (len % 4) {
      case 1:  *blk |= ch << 24;
              break;
      case 2:  *blk |= ch << 16;
              break;
      case 3:  *blk |= ch << 8;
              break;
      default: *blk |= ch;
              break;
    }

    if (p->position == 15 && (len % 4) == 0) { // At the end of the block
      p->next = new_message_block();
      p = p->next;
    } else { 
      if (len % 4 == 0) p->position++;
    }
  }

  // Append the one after this block.
  p->block[p->position] += (1u << (32 - 8 * (len % 4) - 1));

  // Calculate how many zeroes is needed.
  remainder = (len * 8) % 512;
  if (remainder > 447) { // Get a new block
    p->next = new_message_block();
    p = p->next;
  }

  // Convert the length to count of binary.
  len *= 8;

  p->block[14] = (uint32_t) len >> 16;
  p->block[15] = (uint32_t) len;

  return head;
}


struct message_schedule * compute_message_schedule(struct message_block *mb) {
  uint8_t i;
  struct message_schedule *ms;

  if (mb == NULL)
    return NULL;

  ms = new_message_schedule();
  for (i = 0; i < 16; i++) {
    ms->block[i] = mb->block[i];
  }

  for (i = 16; i < 64; i++) {
    ms->block[i] = hash_sigma_1(ms->block[i - 2]) + ms->block[i - 7] + hash_sigma_0(ms->block[i - 15]) + ms->block[i - 16];
  }

  ms->next = compute_message_schedule(mb->next);

  return ms;
}

struct hash * perform_hash(struct hash *hash, struct message_schedule *m) {
  if (m == NULL) return hash;

  uint32_t a, b, c, d, e, f, g, h, tx, ty;
  uint8_t i;

  a = hash->value[0];
  b = hash->value[1];
  c = hash->value[2];
  d = hash->value[3];
  e = hash->value[4];
  f = hash->value[5];
  g = hash->value[6];
  h = hash->value[7];

  for (i = 0; i < 64; i++) {
    tx = h + hash_sum_1(e) + hash_ch(e, f, g) + CUBE_ROOT_256[i] + m->block[i];
    ty = hash_sum_0(a) + hash_maj(a, b, c);
    h = g;
    g = f;
    f = e;
    e = d + tx;
    d = c;
    c = b;
    b = a;
    a = tx + ty;
  }

  hash->value[0] += a;
  hash->value[1] += b;
  hash->value[2] += c;
  hash->value[3] += d;
  hash->value[4] += e;
  hash->value[5] += f;
  hash->value[6] += g;
  hash->value[7] += h;

  return perform_hash(hash, m->next);
} 

void sha256(const char *input) {
    struct message_block *h;
    struct message_schedule *s;
    struct hash * hash = calloc(1, sizeof *hash);
    unsigned int i;

    h = pad_message(input);

    for (i = 0; i < 8; i++)
      hash->value[i] = SQUARE_ROOT_256[i];

    s = compute_message_schedule(h);

    hash = perform_hash(hash, s);

    printf("Hash: ");
    for (i = 0; i < 8; i++)
      printf("%8x ", hash->value[i]);
    printf("\n");

    free_message_block(h);
}

int main(int argc, char *argv[]) {
    if (argc == 1) {
    sha256(NULL);
    } else {
    sha256(argv[1]);
    }
    
    return 0;
}
