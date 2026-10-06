const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = app.listen(3000, async () => {
    console.log('Server running on 3000');
    
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        page.on('console', msg => {
            console.log(`PAGE LOG [${msg.type()}]:`, msg.text());
        });
        
        page.on('pageerror', err => {
            console.log('PAGE ERROR:', err.toString());
        });
        
        console.log('Navigating to root to set localstorage...');
        await page.goto('http://localhost:3000/', { waitUntil: 'load' });
        
        await page.evaluate(() => {
            localStorage.setItem('devj_admin_auth_token_v2', 'appwrite_fake_token_123');
            localStorage.setItem('devj_admin_email', 'admin@devj.com');
        });
        
        console.log('Navigating to /admin ...');
        await page.goto('http://localhost:3000/admin', { waitUntil: 'load' });
        
        // wait for 3s to let React run and crash if any
        await new Promise(r => setTimeout(r, 3000));
        
        await browser.close();
    } catch (e) {
        console.error('Puppeteer error:', e);
    }
    
    server.close();
});
