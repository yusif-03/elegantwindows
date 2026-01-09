# 🔒 Security Fix - Telegram Bot Tokens

## ⚠️ CRITICAL: Token Rotation Required

GitHub detected that your Telegram Bot tokens were exposed in the repository. **You must rotate them immediately.**

## What Was Fixed

✅ Tokens removed from `script.js`  
✅ Tokens moved to `config.js` (now in `.gitignore`)  
✅ All HTML files updated to load `config.js` first  
✅ Created `config.example.js` template for reference  
✅ Added `.gitignore` to protect sensitive files  

## Immediate Actions Required

### 1. Rotate Your Telegram Bot Token (DO THIS FIRST!)

1. Open Telegram → [@BotFather](https://t.me/BotFather)
2. Send `/mybots`
3. Select your bot
4. Choose **"API Token"**
5. Choose **"Revoke current token"**
6. Choose **"Generate new token"**  
7. Copy the new token
8. Update `config.js` with the new token

### 2. Update config.js

Open `config.js` and replace the old token:

```javascript
var BOT_TOKEN = "YOUR_NEW_TOKEN_HERE";  // ← Paste new token here
var CHAT_ID = "7373169686";  // Verify this is still correct
```

### 3. Test the Form

1. Open `contact.html` in a browser
2. Fill out and submit the form
3. Check browser console (F12) for errors
4. Verify message arrives in Telegram

### 4. Remove Tokens from Git History

The old tokens are still in git history. Remove them:

```bash
# Check git history
git log --all --full-history -- script.js

# Option 1: Use git filter-branch (advanced)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch script.js" \
  --prune-empty --tag-name-filter cat -- --all

# Option 2: Use BFG Repo-Cleaner (easier)
# Download from https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --replace-text <(echo "8393029454:AAE7-445B9t1WSeYd993WIAHRz9hpulyAe4==>REMOVED")
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Option 3: Rewrite specific commits (for recent commits only)
git rebase -i HEAD~5  # Adjust number as needed
# Mark commits for editing, remove tokens, continue
```

**⚠️ Warning:** Rewriting git history will change commit hashes. Coordinate with your team if working in a shared repository.

### 5. Verify .gitignore Works

```bash
# This should NOT show config.js
git status

# If config.js appears, check .gitignore
cat .gitignore
```

## File Structure

```
ElegantWindows/
├── .gitignore          ✅ Lists config.js (protects secrets)
├── config.js           🔒 CONTAINS SECRETS - NOT IN GIT
├── config.example.js   ✅ Safe template - CAN commit
├── script.js           ✅ No secrets - uses config.js
└── [other HTML files]  ✅ Load config.js before script.js
```

## How It Works

1. `config.js` contains your actual tokens (local only, not in git)
2. `config.example.js` is a template (safe to commit)
3. All HTML files load `config.js` before `script.js`
4. `script.js` reads tokens from global variables
5. `.gitignore` prevents `config.js` from being committed

## Testing

After rotating tokens, test with:

1. Open `test-telegram.html` in browser
2. Click "Check Configuration" - should show new token
3. Click "Test Direct Request" or "Test With CORS Proxy"
4. Submit the contact form and verify it works

## If You Need Help

- **Token rotation:** See [BotFather docs](https://core.telegram.org/bots/api)
- **Git history cleanup:** See [SECURITY.md](SECURITY.md)
- **GitHub secrets scanning:** [GitHub Docs](https://docs.github.com/en/code-security/secret-scanning)

## Prevention

✅ Always check `.gitignore` before committing  
✅ Never commit files with "config.js" or "secret" in name  
✅ Use `git status` before every commit  
✅ Review diffs before pushing  
✅ Rotate tokens immediately if exposed  

---

**Status:** 🔴 Tokens need to be rotated  
**Next Step:** Follow "Immediate Actions Required" above

