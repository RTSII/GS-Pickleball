Spec Kit (third-party)

What I will do

- Install the official GitHub Spec Kit into a non-conflicting `third_party/spec-kit` folder as a shallow git clone.
- Do not overwrite any existing project files. The clone will be separate from existing `temp-spec-kit`.

Why this approach

- `temp-spec-kit` appears to be a snapshot of Spec Kit included in this repo. Replacing it directly risks overwriting local changes
- Adding `third_party/spec-kit` keeps the official upstream copy separate and easy to update with `git pull` or `git fetch` without changing project files.

Commands to run (PowerShell)

# create the directory and perform a shallow clone of the latest release/main
# NOTE: run these from the project root (c:\Users\rtsii\Desktop\GS-Pickleball)

mkdir third_party; cd third_party;
# shallow clone main branch
git clone --depth 1 https://github.com/github/spec-kit.git spec-kit

# Optional: to update later, run (inside third_party/spec-kit):
# git fetch --depth 1 origin main; git reset --hard origin/main

Alternative: add as a submodule

# add spec-kit as a git submodule (keeps history and separable)
git submodule add https://github.com/github/spec-kit.git third_party/spec-kit

Notes

- This does not remove or modify `temp-spec-kit`. After verifying the new copy, you can decide to delete or keep `temp-spec-kit`.
- If you prefer the Python package (specify-cli) installed globally or in a venv, use `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git` as documented in the Spec Kit README.

If you'd like, I can create a commit that adds `third_party/.gitkeep` and `THIRD_PARTY_SPEC_KIT.md` and optionally a script to automate cloning, or I can run the clone for you if you allow terminal/network access. Let me know which you'd prefer.