#!/bin/bash
USERNAME="anyplace"
PASSWORD="anyplace"
BUCKET="anyplace"
curl -X PUT -H "Content-Type: application/json" http://localhost:8092/$BUCKET/_design/dev_loc_history -d @history.json -u $USERNAME:$PASSWORD
##########
# PUBLISH
##########

curl -X PUT -H "Content-Type: application/json" http://localhost:8092/$BUCKET/_design/loc_history -d @history.json -u $USERNAME:$PASSWORD