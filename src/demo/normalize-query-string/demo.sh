#!/bin/bash

##Color
BLUEBK='\033[0;44m'
YELLOW='\033[0;93m'
GREEN='\033[0;92m'
NC='\033[0m'
cfdomain='?.cloudfront.net'

START_TIME=$(date +%s)
questr='key2=val2&key1=val1'
echo -en "${BLUEBK}Task1${NC} curl ${GREEN}${questr}${NC}\n"
curl -vs --stderr - -X GET "https://${cfdomain}/hellocdk?${questr}" > tmp
cat tmp | grep "Trying"
cat tmp | grep "X-Cache"

questr='key1=val1&key2=val2'
echo -en "${BLUEBK}Task2${NC} curl ${GREEN}${questr}${NC}\n"
curl -vs --stderr - -X GET "https://${cfdomain}/hellocdk?${questr}" > tmp
cat tmp | grep "Trying"
cat tmp | grep "X-Cache"

questr='KEY2=VAL2&KEY1=VAL1'
echo -en "${BLUEBK}Task3${NC} curl ${GREEN}${questr}${NC}\n"
curl -vs --stderr - -X GET "https://${cfdomain}/hellocdk?${questr}" > tmp
cat tmp | grep "Trying"
cat tmp | grep "X-Cache"

questr='KEY2=VAL2&key1=val1'
echo -en "${BLUEBK}Task4${NC} curl ${GREEN}${questr}${NC}\n"
curl -vs --stderr - -X GET "https://${cfdomain}/hellocdk?${questr}" > tmp
cat tmp | grep "Trying"
cat tmp | grep "X-Cache"

END_TIME=$(date +%s)
echo -en "${YELLOW}Elapsed time: $(($END_TIME - $START_TIME)) s${NC}\n"


