#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
设置 GitHub 仓库的 description / homepage / topics。
配置读自 .github/repo-meta.yml，token 从命令行参数传入（不落盘）。
"""
import json
import os
import sys
import urllib.request
import urllib.error

REPO = "xiaoyouya12-ui/xyy"
API = "https://api.github.com"


def api(method, path, token, payload=None):
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        API + path,
        data=data,
        method=method,
        headers={
            "Authorization": "Bearer " + token,
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
            "User-Agent": "xyy-meta-sync",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            body = r.read().decode("utf-8")
        return json.loads(body) if body.strip() else {}
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "ignore")
        print("  [HTTP %s] %s" % (e.code, detail[:300]))
        raise


def parse_config(path):
    """极简 YAML 解析：只认 description / homepage / topics 三个键。"""
    desc = homepage = ""
    topics = []
    in_topics = False
    with open(path, encoding="utf-8") as f:
        for raw in f:
            line = raw.rstrip("\n")
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            if line.startswith("description:"):
                desc = line.split(":", 1)[1].strip().strip('"').strip("'")
                in_topics = False
            elif line.startswith("homepage:"):
                homepage = line.split(":", 1)[1].strip().strip('"').strip("'")
                in_topics = False
            elif line.startswith("topics:"):
                in_topics = True
            elif in_topics and line.startswith("  - "):
                topics.append(line[4:].strip().strip('"').strip("'"))
            elif in_topics and not line.startswith(" "):
                in_topics = False
    return desc, homepage, topics


def main():
    if len(sys.argv) < 2:
        print("用法: python set_repo_meta.py <PAT> [配置文件路径]")
        return 2
    token = sys.argv[1].strip()
    cfg = sys.argv[2] if len(sys.argv) > 2 else ".github/repo-meta.yml"

    if not os.path.exists(cfg):
        print("找不到配置文件: %s" % cfg)
        return 2

    desc, homepage, topics = parse_config(cfg)
    print("读取配置:")
    print("  description: %s" % desc)
    print("  homepage:    %s" % homepage)
    print("  topics:      %s" % ", ".join(topics))

    print("\n[1/3] 更新 description / homepage ...")
    r = api("PATCH", "/repos/" + REPO, token, {
        "description": desc,
        "homepage": homepage,
    })
    print("  description -> %r" % r.get("description"))
    print("  homepage    -> %r" % r.get("homepage"))

    print("\n[2/3] 更新 topics ...")
    r = api("PUT", "/repos/" + REPO + "/topics", token, {"names": topics})
    print("  topics -> %s" % ", ".join(r.get("names", [])))

    print("\n[3/3] 回读校验 ...")
    r = api("GET", "/repos/" + REPO, token)
    print("  description: %r" % r.get("description"))
    print("  homepage:    %r" % r.get("homepage"))
    print("  topics:      %s" % ", ".join(r.get("topics", [])))
    return 0


if __name__ == "__main__":
    sys.exit(main())
