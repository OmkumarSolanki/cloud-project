#!/bin/bash

# https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-8
# sudo dnf install mysql-server -y
# sudo systemctl start mysqld.service
# sudo systemctl enable mysqld
# Comment Above

# https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-centos-8
sudo dnf module enable nodejs:20 -y
sudo dnf install nodejs -y

# sudo mkdir test