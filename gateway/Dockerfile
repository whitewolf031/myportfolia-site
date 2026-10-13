FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/nginx.conf

# Create static and media directories
RUN mkdir -p /var/www/static /var/www/media \
    && chown -R nginx:nginx /var/www/static /var/www/media

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:80/gateway-health/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
