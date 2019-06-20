### jenkins

#####  Mac

1. brew install jenkins

2. 获取jenkins默认配置:defaults read /Library/Preferences/org.jenkins-ci

   `{
   ​    heapSize = 512m;
   ​    httpListenAddress = "127.0.0.1";
   ​    httpPort = 9999;
   ​    minHeapSize = 256m;
   ​    minPermGen = 256m;
   ​    permGen = 512m;
   ​    tmpdir = "/Users/Shared/Jenkins/tmp";
   }`

3. 修改jenkins 默认端口,由于是brew安装如果已经启动过了，默认它就是后台服务了，就不能用defaults write /Library/Preferences/org.jenkins-ci httpPort 9999 来修改端口号，只能 vim /usr/local/opt/jenkins/homebrew.mxcl.jenkins.plist 

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
     <dict>
       <key>Label</key>
       <string>homebrew.mxcl.jenkins</string>
       <key>ProgramArguments</key>
       <array>
         <string>/usr/libexec/java_home</string>
         <string>-v</string>
         <string>1.8</string>
         <string>--exec</string>
         <string>java</string>
         <string>-Dmail.smtp.starttls.enable=true</string>
         <string>-jar</string>
         <string>/usr/local/opt/jenkins/libexec/jenkins.war</string>
         <string>--httpListenAddress=127.0.0.1</string>
         <string>--httpPort=9999</string>
       </array>
       <key>RunAtLoad</key>
       <true/>
     </dict>
   </plist>
   ```


4. jenkins 初始化密码地址 /Users/snoy/.jenkins/secrets/initialAdminPassword