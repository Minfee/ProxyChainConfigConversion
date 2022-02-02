FROM node:16.13.2
RUN mkdir /usr/share/node
COPY ./dist /usr/share/node/dist
WORKDIR /usr/share/node

ENV HOST 0.0.0.0
ENV PORT 9090
# 开放端口
EXPOSE 9090
# 容器启动命令
CMD ["node","dist/main.js"]