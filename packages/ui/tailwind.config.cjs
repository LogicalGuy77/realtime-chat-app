/** @type {import('tailwindcss').Config} */
const config = require("../tw-config/tailwind.config.cjs");

module.exports = {
    ...config,
    content : ["./src/**/*.tsx"]
};