#!/usr/bin/env bash
rm -rf generated/*
mvnd clean package install -Dquickly -DskipTests=true -Dmaven.javadoc.skip=true -Dmaven.compile.fork=true -T 16C