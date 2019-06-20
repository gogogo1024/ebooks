# Email应用

## Email消息格式

- SMTP:email消息的传输/交换协议
- [RFC 822](http://www.rfc-editor.org/pdfrfc/rfc822.txt.pdf):文本消息格式标准

  - 头部行(header)
    - To
    - From
    - Subject

  - 消息体(body)
    - 消息本身
    - 只能是ASCII字符
- MIME:多媒体邮件扩展 [RFC2045](http://www.rfc-editor.org/pdfrfc/rfc2045.txt.pd),[2056](http://www.rfc-editor.org/pdfrfc/rfc2056.txt.pd)

  通过在邮件头部增加额外的行以声明MIME的内容类型
    - MIME-Version:1.0(MIME多媒体扩展的版本)
    - Content-Transfer-Encoding:base64(数据编码的方式,接受者浏览器自动用base64来解码)
    - Content-Type:image/ipeg(d多媒体数据的类型，字类型以及参数说明)
    - 邮件内容需要换行把图片buffer转成base64

## 邮件访问协议

SMTP是发送邮件的协议，从服务器获取邮件使用POP(post office protocol [RFC 1939](http://www.rfc-editor.org/pdfrfc/rfc1939.txt.pdf))，IMAP(internet mail access protocol [RFC 1730](http://www.rfc-editor.org/pdfrfc/rfc1730.txt.pdf))，HTTP-邮件访问协议

- POP 认证/授权(客户端和服务器之间)下载
  - 认证过程
    - 客户端命令
      - User:声明用户名
      - Pass:声明密码
    - 服务器响应
      - +OK
      - -ERR
  - 事务阶段
    - List:列出消息数量
    - Retr:用编号混去消息
    - Dele:删除消息
    - Quit

pop的下载并删除模式，当用户换了客户端软件软件时，由于服务器端已经删除了用户的邮件，因此无法重读该邮件，而在下载并保持的模式下，当用户的邮件信息下载了邮件后，服务器端依然保存用户的邮件，因此用户可以在不同的客户端软件重读该邮件，相应的服务器的容量就需要增大了相比于下载并删除模式，因为客户已读的邮件，服务器端依然保留

- IMAP 更多功能，更加复杂，能够操作服务器上存储的信息
  - 所有消息统一保存在一个地方:服务器
  - 允许用户利用文件夹组织消息
  - 支持跨会话(session)的用户状态
    - 文件夹的名字
    - 文件夹与消息ID之间的映射等
- HTTP web版的邮箱
