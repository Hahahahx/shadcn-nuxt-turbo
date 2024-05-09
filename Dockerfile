FROM node:20

WORKDIR /app
COPY . /app

RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm i
RUN pnpm build:web

EXPOSE 3000

CMD [ "pnpm" ,"preview:web" ]

