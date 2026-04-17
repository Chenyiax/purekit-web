# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 设置 npm 镜像加速（适用于国内环境）
RUN npm config set registry https://registry.npmmirror.com

# 拷贝依赖定义文件
COPY package.json package-lock.json ./

# 安装依赖
RUN npm install

# 拷贝源代码并执行构建
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine

# 拷贝构建后的静态资源
COPY --from=builder /app/dist /usr/share/nginx/html

# 拷贝自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
