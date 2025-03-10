FROM node:16

ARG COMMIT
ARG NPM_USER
ARG NPM_PASS
ARG NPM_EMAIL
ARG NPM_REGISTRY
ARG MAGENTO_EXTERNAL_CHECKOUT
ARG MAGENTO_EXTERNAL_CHECKOUT_SYNC_PATH
ARG STORE_URL
ARG IMAGE_PROVIDER_BASE_URL
ARG REDIS__HOST
ARG REDIS__PORT
ARG REDIS__CACHE_INVALIDATE_KEY
ARG RECAPTCHA_ENABLED
ARG RECAPTCHA_HIDE_BADGE
ARG RECAPTCHA_VERSION
ARG RECAPTCHA_SIZE
ARG RECAPTCHA_MIN_SCORE
ARG RECAPTCHA_SITE_KEY
ARG RECAPTCHA_SECRET_KEY

ENV MAGENTO_GRAPHQL=https://magento2-instance.vuestorefront.io:8443/graphql
ENV MAGENTO_EXTERNAL_CHECKOUT_URL=https://magento2-instance.vuestorefront.io
ENV MAGENTO_EXTERNAL_CHECKOUT=${MAGENTO_EXTERNAL_CHECKOUT}
ENV MAGENTO_EXTERNAL_CHECKOUT_SYNC_PATH=${MAGENTO_EXTERNAL_CHECKOUT_SYNC_PATH}
ENV STORE_URL=${STORE_URL}
ENV LAST_COMMIT=${COMMIT}
ENV STORE_ENV=production
ENV NUXT_APP_ENV=production
ENV NUXT_APP_PORT=3000
ENV MAGENTO_BASE_URL=https://magento2-instance.vuestorefront.io/
ENV IMAGE_PROVIDER=cloudinary
ENV IMAGE_PROVIDER_BASE_URL=${IMAGE_PROVIDER_BASE_URL}
ENV REDIS__HOST=${REDIS__HOST}
ENV REDIS__PORT=${REDIS__PORT}
ENV REDIS__CACHE_INVALIDATE_KEY=${REDIS__CACHE_INVALIDATE_KEY}
ENV REDIS__CACHE_INVALIDATE_URL=/cache-invalidate
ENV REDIS__KEY_PREFIX=magento2vsf2
ENV REDIS__ENABLED=true
ENV SENTRY_DSN=${SENTRY_DSN}
ENV RECAPTCHA_ENABLED=false
ENV RECAPTCHA_HIDE_BADGE=false
ENV RECAPTCHA_VERSION=3
ENV RECAPTCHA_SIZE=invisible
ENV RECAPTCHA_MIN_SCORE=0.5
ENV RECAPTCHA_SITE_KEY=${RECAPTCHA_SITE_KEY}
ENV RECAPTCHA_SECRET_KEY=${RECAPTCHA_SITE_KEY}

RUN npm config set @vsf-enterprise:registry=https://registrynpm.storefrontcloud.io

RUN npm install -g npm-cli-login \
  && npm-cli-login

WORKDIR /var/www

COPY . .

RUN mv /var/www/packages/theme/nuxt.config.js /var/www/packages/theme/base.nuxt.config.js && cp .vuestorefrontcloud/docker/nuxt.config.additional.js /var/www/packages/theme/nuxt.config.js

RUN yarn install

RUN npx yarn@1.19.0 workspace @vue-storefront/magento-theme add @nuxtjs/sentry @sentry/tracing


RUN yarn build && yarn cache clean --all
COPY .vuestorefrontcloud/docker/vue-storefront.sh /usr/local/bin/

RUN chmod a+x /usr/local/bin/vue-storefront.sh

ENTRYPOINT ["vue-storefront.sh"]
