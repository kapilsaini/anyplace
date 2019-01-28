#!/bin/bash
USERNAME="anyplace"
PASSWORD="anyplace"
BUCKET="anyplace"
curl -X PUT -H "Content-Type: application/json" http://172.20.3.156:8092/$BUCKET/_design/dev_loc_history -d @history.json -u $USERNAME:$PASSWORD
curl -X PUT -H "Content-Type: application/json" http://172.20.3.156:8092/$BUCKET/_design/dev_auth_ap -d @auth_accesspoint.json -u $USERNAME:$PASSWORD


##########
# PUBLISH
##########

curl -X PUT -H "Content-Type: application/json" http://172.20.3.156:8092/$BUCKET/_design/loc_history -d @history.json -u $USERNAME:$PASSWORD
curl -X PUT -H "Content-Type: application/json" http://172.20.3.156:8092/$BUCKET/_design/auth_ap -d @auth_accesspoint.json -u $USERNAME:$PASSWORD
