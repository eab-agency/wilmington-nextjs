#!/bin/bash

# Script to switch WordPress environments and regenerate possibleTypes.json

# Function to show usage information
show_usage() {
  echo "Usage: $0 [dev|test|prod]"
  echo ""
  echo "Options:"
  echo "  dev   - Use development environment (dev-wilmington-college.pantheonsite.io)"
  echo "  test  - Use test environment (wordpress-test.wilmington.edu)"
  echo "  prod  - Use production environment (wordpress.wilmington.edu)"
  echo ""
  exit 1
}

# Check if an argument was provided
if [ $# -ne 1 ]; then
  show_usage
fi

# Get the environment from the argument
ENV=$1

# Set the WordPress URL based on the environment
case $ENV in
  dev)
    WP_URL="https://dev-wilmington-college.pantheonsite.io/"
    echo "Switching to Development environment: $WP_URL"
    ;;
  test)
    WP_URL="https://wordpress-test.wilmington.edu/"
    echo "Switching to Test environment: $WP_URL"
    ;;
  prod)
    WP_URL="https://wordpress.wilmington.edu/"
    echo "Switching to Production environment: $WP_URL"
    ;;
  *)
    echo "Invalid environment: $ENV"
    show_usage
    ;;
esac

# Update .env.local file with the new WordPress URL
sed -i.bak "s|^NEXT_PUBLIC_WORDPRESS_URL=.*|NEXT_PUBLIC_WORDPRESS_URL=$WP_URL|" .env.local

# Regenerate possibleTypes.json using the new WordPress URL
echo "Regenerating possibleTypes.json for $ENV environment..."
npm run generate

echo "Environment switched to $ENV and possibleTypes.json regenerated!"
echo "You can now build the application with: npm run build"
