---
title: 'Spring Boot 配置类的学习'
date: '2026-04-01'
tags: ['SpringBoot', '后端']
excerpt: '记录springboot中各种的配置类，由于这些配置类不常写，但是也是很重要的，避免遗忘所以记录'
coverImage: ''
---

> 本人决定转向考公了，所以暂时不写了💀

## 统一返回结构与全局异常处理

## 1. 创建统一返回类 `Result<T>`

```java
@Data
public class Result<T> {
    private Integer code;
    private String msg;
    private T data;

    private Result(Integer code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    public static <T> Result<T> success() {
        return new Result<>(200, "Success", null);
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(200, "Success", data);
    }

    public static <T> Result<T> error(String msg) {
        return error(500, msg); // 默认服务器错误
    }

    public static <T> Result<T> error(Integer code, String msg) {
        return new Result<>(code, msg, null);
    }

    public static <T> Result<T> badRequest(String msg) {
        return error(400, msg);
    }

    public static <T> Result<T> unauthorized(String msg) {
        return error(401, msg);
    }

    public static <T> Result<T> forbidden(String msg) {
        return error(403, msg);
    }

    public static <T> Result<T> notFound(String msg) {
        return error(404, msg);
    }
}
```

## 2. 自定义业务异常类

```java
@Getter
public class BaseException extends RuntimeException implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private final Integer code;

    public BaseException(Integer code, String msg) {
        super(msg);
        this.code = code;
    }
}
```

```java
public class BusinessException extends BaseException implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    public BusinessException(String msg) {
        super(500, msg);
    }
}
```

## 3. 全局异常处理器

```java
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    // 处理自定义业务异常
    @ExceptionHandler(BusinessException.class)
    public Result<String> handleBusinessException(BusinessException e) {
        log.error("业务异常：{}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }

    // 处理未捕获异常
    @ExceptionHandler(Exception.class)
    public Result<String> handleException(Exception e) {
        log.error("系统异常：", e); // 打印完整异常内容
        return Result.error(500, e.getMessage());
    }
}
```


