# Use a lightweight web server for static files
FROM nginx:alpine

# Copy the build folder into nginx's default folder
COPY dist/ /usr/share/nginx/html/


# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


