import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { Link } from 'gatsby'

const About = () => (
  <Layout>
    <SEO title="About Antony" />
    <h1>About</h1>
    <p>
      I am a product owner with a passion for user experience.  I’ve worked at Microsoft, Agoda, Apple, and most recently, Binaural Waves, crafting products that people love and use everyday.  I have both technical experience in programming, system administration, and data crunching, in addition to driving features to their conclusion through program management.  I’ve traveled and worked across the globe and I take my worldwide experiences with me everywhere.
    </p>
    <p>
      <strong>Technology is my life</strong>
    </p>
    <p>
      I'm passionate about new interfaces.  I think the old keyboard and mouse has been around too long and is limiting our capacity to express ourselves on our more modern, AI and ML capable computing platforms.  We should explore why seizures can be caused by flashing lights and see if there's an opportunity to turn this trigger into a way to communicate with the brain.  Furthermore, binaural beats are often lauded as a way to excite the various frequencies upon our brain operates.  Attuning our interface development to be more cognizant of the flexibility of human hearing and sight is something missing in today's interfaces.
    </p>
    <p>
      Back in 2008, I only had two devices.  Now, I have a variety of always connected devices to maintain.  My primary device is my Macbook Pro, upon which I run various containers and virtual machines to stay abreast of the latest Linux distributions and packages.  My secondary device is an old Dell M6800 which serves as an excellent Debian server.  I also have a phone.
    </p>
    <p>
      In the next decade or so, we'll see huge advancements in network coverage, upload speed, lossless compression, and power storage.  These in tandem will give way to new applications such as in YouTube where videos is downloaded directly from creator's devices instead of being stored on a centralised server.
    </p>
    <p>
      In my spare time, I enjoy running, as I did when young, as a way to stay healthy and upbeat.  Music is also one of my favourite pastimes and you'll find me listening to <a href="http://www.ulrich-schnauss.com/">Ulrich Schnauss</a>, <a href="https://bleep.com/artist/78-boards-of-canada">Boards of Canada</a>, <a href="http://radiohead.com/">Radiohead</a>, and <a href="https://en.wikipedia.org/wiki/Girls%27_Generation">SNSD</a>, among others.
    </p>
    <p>
      Finally, I consider myself an avid reader and enjoy works from the likes of Stephen King, Ken Catran, Ayn Rand, and many others.  See my <Link to="/bookshelf">bookshelf</Link> for a list of my recent reads.
    </p>




  </Layout>
)

export default About
