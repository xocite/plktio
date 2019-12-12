---
path: "/writing/docker-vagrant-tips"
date: "2019-12-11"
title: "Some Docker and Vagrant tips"
commentary: false
attract: "A quick reference for effectively using Docker and Vagrant together."
---

While I'm slowly migrating my blog over to Wordpress, I've been experimenting with build environments on my Mac and Linux server using a combination of Docker, Vagrant, and Ansible.  Here are some of the tips I've compiled to improve my effectiveness using these tools.

# Docker
Building and running the current context with 
```
docker run --rm `docker build -q .`
```

Cleaning up all the abandoned containers.
```
docker system prune -a
```

At some point you'll find that you want to combine multiple builds into a single file.  Luckily Docker now allows multi-stage builds, see [here](https://docs.docker.com/develop/develop-images/multistage-build/).

# Vagrant
Vagrant can work together with Ansible if you add the playbook information in your Vagrantfile, like so:

```
  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "../ansible/site.yml"
  end
```

The login information will automatically be copied over so Ansible can run on the virtual machine.  You can also view the config by running `vagrant ssh-config` in the directory of the virtual machine.

# Ansible
When using Ansible, it's best to split up the tasks into roles so you can reuse them later.  A typical directory layout looks like:
```
./site.yml [playbook]: starts the entire environment.
./hosts [yaml or INI file]: contains the list of hosts.  I prefer to use the YAML format here.
./roles [directory]
./roles/common [directory]: common tasks to run on each server
./roles/common/handlers [directory]: handlers specific to common but can be used anywhere
./roles/common/tasks [directory]: list of tasks to be executed by this role
./roles/common/files [directory]: any files that need to be deployed
./roles/common/templates [directory]: a collection of templates that can be deployed with the common role
./roles/common/vars [directory]: variables (that aren't in the defaults) for the common role
./roles/common/defaults [directory]: default values for the variables for the common role deployment
./roles/common/meta [directory]: configuration files related to managing ansible
```

I would spend a bit of time understanding static and dynamic importing [(more information here)](https://docs.ansible.com/ansible/latest/user_guide/playbooks_reuse_roles.html) as I think the added flexibility has the potential to cause difficult to debug errors in deployments.

Roles are then included just like any other task.
```yaml
---

- hosts: webservers
  tasks:
  - include_role:
      name: foo_app_instance
```