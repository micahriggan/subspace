#!/bin/bash
geth --datadir node1 --port 3000 --rpc --rpcapi personal,web3,eth,net,miner,txpool,db,clique --unlock '0' --password '' --mine
