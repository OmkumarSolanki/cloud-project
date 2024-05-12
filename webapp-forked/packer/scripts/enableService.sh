#!/bin/bash

sudo systemctl daemon-reload
sudo systemctl enable runApp.service
sudo systemctl start runApp.service
sudo systemctl restart runApp.service