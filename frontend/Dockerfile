FROM nginx:alpine

LABEL maintainer="CoffeeCraft Team"
LABEL description="CoffeeCraft Frontend App (Angular 22 + Nginx)"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
