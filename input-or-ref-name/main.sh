#!/bin/bash

if [ -n "${TARGET_REF}" ]; then
    echo ::set-output name=ref::$(echo ${TARGET_REF})
    echo ::set-output name=ref-name::$(echo ${TARGET_REF})
else
    echo ::set-output name=ref::$(echo ${GITHUB_REF})
    echo ::set-output name=ref-name::$(echo ${GITHUB_REF#refs/*/})
fi