#!/bin/bash

curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

# sudo mv add-google-cloud-ops-agent-repo.sh /opt/
#  To check status sudo systemctl status google-cloud-ops-agent
# home/csye6225/app/logs-app/
# etc/google-cloud-ops-agent/config.yaml 