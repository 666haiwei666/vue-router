1. !/[^\u0000-\u007F]+/.test(path) 校验
2. path.replace(/\/$/, '')  // 以斜杠结尾的