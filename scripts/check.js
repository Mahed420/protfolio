// Production check: no secrets in source, no absolute-path assets (breaks under /protfolio), JS parses.
const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync('index.html','utf8');let bad=0;
const secrets=/(AIza[0-9A-Za-z_-]{30,}|sk-[A-Za-z0-9]{20,}|re_[A-Za-z0-9]{20,})/;
for(const f of ['index.html','api/chat.js','api/contact.js'])if(secrets.test(fs.readFileSync(f,'utf8'))){console.error('SECRET-LIKE STRING in',f);bad=1}
if(/(src|href)="\/(?!\/)/.test(html)){console.error('Absolute-path asset found (breaks GitHub Pages subpath)');bad=1}
const js=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
try{new vm.Script(js)}catch(e){console.error('JS syntax error',e.message);bad=1}
for(const f of ['api/chat.js','api/contact.js']){try{new vm.Script(fs.readFileSync(f,'utf8').replace(/export default/,'module.exports='))}catch(e){console.error(f,e.message);bad=1}}
console.log(bad?'CHECK FAILED':'CHECK OK');process.exit(bad);
