#!/bin/bash

# Fix MessagesController directory naming to match Auth service pattern
echo "Fixing MessagesController directory naming..."

# Navigate to MessagesController directory
cd /Users/danielbucket/BucketLimited/projects/BucketLab_api/laboratory/src/v1/controllers/MessagesController

# Rename directories to remove underscores (match Auth service pattern)
if [ -d "DELETE_" ]; then
    mv DELETE_ DELETE
    echo "Renamed DELETE_ to DELETE"
fi

if [ -d "GET_" ]; then
    mv GET_ GET
    echo "Renamed GET_ to GET"
fi

if [ -d "PATCH_" ]; then
    mv PATCH_ PATCH
    echo "Renamed PATCH_ to PATCH"
fi

if [ -d "POST_" ]; then
    mv POST_ POST
    echo "Renamed POST_ to POST"
fi

echo "Directory renaming complete!"
echo "New structure:"
ls -la

echo "Don't forget to update the index.js file to match the new directory names!"
