const dotenv = require('dotenv');
const { IsString } = require('class-validator');
const express = require('express');
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const CREDENTIALS = process.env.CREDENTIALS === 'true';
const { NODE_ENV, PORT, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, SESSION_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST } = process.env;

module.exports = {
    CREDENTIALS,
    NODE_ENV,
    PORT,
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    SESSION_KEY,
    LOG_FORMAT,
    LOG_DIR,
    ORIGIN,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_HOST,
};
