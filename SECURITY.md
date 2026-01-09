# Security Guide - Telegram Bot Integration

## ⚠️ Important Security Information

Your Telegram Bot tokens were exposed in the code repository. This is a security risk.

## What Was Done

1. **Moved sensitive tokens** from `script.js` to `config.js`
2. **Added `config.js` to `.gitignore`** - this file will NOT be committed to git
3. **Created `config.example.js`** - a template file that IS safe to commit

## Required Actions

### 1. Rotate Your Telegram Bot Token (CRITICAL)

**You MUST revoke and create a new bot token** because the old one was exposed:

1. Open Telegram and find [@BotFather](https://t.me/BotFather)
2. Send `/mybots`
3. Select your bot
4. Choose "API Token"
5. Choose "Revoke current token" or "Generate new token"
6. Copy the new token
7. Update it in `config.js` (local file, not in git)

### 2. Verify Chat ID

1. Open Telegram and find [@userinfobot](https://t.me/userinfobot)
2. Send any message to get your Chat ID
3. Verify it matches the CHAT_ID in `config.js`

### 3. Setup Configuration File

The `config.js` file already exists with your current tokens, but you need to:

1. **Verify** `config.js` is in `.gitignore` (it should be)
2. **Never commit** `config.js` to git
3. **Update tokens** in `config.js` after rotating them

### 4. Remove Exposed Tokens from Git History (IMPORTANT)

The old tokens are still in git history. To remove them:

**Option A: Using git-filter-repo (Recommended)**
```bash
# Install git-filter-repo first
git filter-repo --path script.js --invert-paths
# Then re-add script.js without tokens
git add script.js
git commit -m "Remove exposed tokens from script.js"
```

**Option B: Using BFG Repo-Cleaner**
```bash
# Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --replace-text tokens.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

**Option C: Rewrite history manually (for small repos)**
```bash
git rebase -i HEAD~10  # Adjust number based on commits
# Mark commits with tokens for editing
# Remove tokens from those commits
```

### 5. Verify .gitignore is Working

```bash
# Check if config.js is ignored
git status
# config.js should NOT appear in the list
```

If `config.js` appears in `git status`, it's not being ignored. Check `.gitignore` file.

## File Structure

```
ElegantWindows/
├── config.js           ← CONTAINS SECRETS - NOT IN GIT
├── config.example.js   ← Template file - SAFE TO COMMIT
├── .gitignore          ← Lists config.js
└── script.js           ← No secrets, uses config.js
```

## Testing

After rotating tokens:

1. Update `config.js` with new token
2. Test the form submission
3. Check browser console for any errors
4. Verify messages arrive in Telegram

## Best Practices Going Forward

1. ✅ Never commit API keys, tokens, or secrets
2. ✅ Always use `.gitignore` for sensitive files
3. ✅ Use environment variables or config files for secrets
4. ✅ Rotate tokens immediately if exposed
5. ✅ Review git commits before pushing

## If Tokens Are Compromised

1. **Immediately revoke** the exposed token in BotFather
2. **Generate new token**
3. **Update** `config.js` with new token
4. **Remove** old token from git history (see above)
5. **Force push** to remote (be careful - coordinate with team)
6. **Monitor** bot for unauthorized usage

## Questions?

If you need help with any of these steps, consult:
- [GitHub Security Best Practices](https://docs.github.com/en/code-security/secret-scanning)
- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)

