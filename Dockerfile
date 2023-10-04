# syntax=docker/dockerfile:1.4
FROM node:16-alpine3.16 as build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm --registry https://registry.npm.taobao.org install

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

FROM nginx:stable-alpine as image

COPY --link --from=build /app/dist /usr/share/nginx/html

COPY --link ./docker.nginx.conf /etc/nginx/conf.d/default.conf 

EXPOSE 80

