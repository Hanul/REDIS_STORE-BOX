# REDIS_STORE_BOX
***UPPERCASE 1.5의 REDIS_STORE를 백업한 프로젝트입니다. UPPERCASE 2.0에선 [`SHARED_STORE`](https://github.com/Hanul/UPPERCASE/blob/master/DOC/GUIDE/UPPERCASE-CORE-NODE.md#shared_storestorename)를 사용해주시기 바랍니다.***

`REDIS_STORE(name)`

## 함수
* `save({name:, value:})` `save({name:, value:}, callbackOrHandlers)` 특정 `name`에 `value`를 저장합니다.
* `get(name, callbackOrHandlers)` `name`의 값을 가져옵니다. 값이 없는 경우 `undefined`가 반환됩니다.
* `remove(name)` `remove(name, callbackOrHandlers)` `name`의 값을 지웁니다.
* `list(callbackOrHandlers)` 저장소의 모든 값을 가져옵니다.
* `count(callbackOrHandlers)` 저장소의 값들의 개수를 가져옵니다.
* `clear()` `clear(callbackOrHandlers)` 저장소의 모든 값을 삭제합니다.

## `NODE_CONFIG` 설정
* `redisHost` Redis 서버의 호스트를 설정합니다. 기본값은 `'127.0.0.1'` 입니다.
* `reidsPort` Redis 서버의 포트를 설정합니다. 기본값은 `6379` 입니다.
* `reidsPorts` Redis를 분산 서버 환경으로 구성한 경우, Redis 서버들의 포트를 설정합니다.

## Redis를 분산 서버 환경으로 구성하기
redis 폴더로 이동합니다.
```
cd redis-stable
```

CPU 개수만큼 폴더를 만듭니다.
```
mkdir 7001 7002 7003 7004 7005 7006 7007 7008
```

7001 폴더에 redis.conf 파일을 복사한 후 아래 내용들을 수정합니다. 특히, 여러 서버로 분산 처리 하는 경우에는 bind에 다른 서버의 ip 주소를 등록해야 합니다.
```
cp redis.conf 7001

vi 7001/redis.conf
...
```
```
daemonize yes
port 7001
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 15000
dir ./7001/
logfile "redis.log"
```

이 redis.conf 파일을 각 폴더에 복사한 후 port및 dir을 각 폴더명으로 변경합니다.
```
cp 7001/redis.conf 7002
cp 7001/redis.conf 7003
cp 7001/redis.conf 7004
cp 7001/redis.conf 7005
cp 7001/redis.conf 7006
cp 7001/redis.conf 7007
cp 7001/redis.conf 7008

vi 7002/redis.conf
...
```

이제 각 port의 Redis들을 시작합니다.
```
src/redis-server 7001/redis.conf
src/redis-server 7002/redis.conf
src/redis-server 7003/redis.conf
src/redis-server 7004/redis.conf
src/redis-server 7005/redis.conf
src/redis-server 7006/redis.conf
src/redis-server 7007/redis.conf
src/redis-server 7008/redis.conf
```

클러스터들을 설정하기 위해 redis-trib 유틸리티를 실행합니다. 참고로, 이 유틸리티는 루비로 작성되어 있어 실행하기 위해서는 루비와 rubygems, 루비용 redis 클라이언트가 설치되어 있어야 합니다.
```
sudo yum install ruby
sudo gem install redis
```
```
src/redis-trib.rb create 127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 127.0.0.1:7006 127.0.0.1:7007 127.0.0.1:7008
```

중간에 아래와 같은 메시지가 뜨면 yes를 입력합니다.
```
Can I set the above configuration? (type 'yes' to accept): yes
```

모든 설정이 끝났습니다. Redis에 접속합니다.
```
src/redis-cli -c -p 7001
```

### Redis 서버 초기화
```
src/redis-cli -c -p 7001 flushall
src/redis-cli -c -p 7002 flushall
src/redis-cli -c -p 7003 flushall
src/redis-cli -c -p 7004 flushall
src/redis-cli -c -p 7005 flushall
src/redis-cli -c -p 7006 flushall
src/redis-cli -c -p 7007 flushall
src/redis-cli -c -p 7008 flushall
```

### Redis 서버를 재시작 하는 경우
모든 Redis 서버들을 종료합니다.
```
src/redis-cli -c -p 7001 shutdown
src/redis-cli -c -p 7002 shutdown
src/redis-cli -c -p 7003 shutdown
src/redis-cli -c -p 7004 shutdown
src/redis-cli -c -p 7005 shutdown
src/redis-cli -c -p 7006 shutdown
src/redis-cli -c -p 7007 shutdown
src/redis-cli -c -p 7008 shutdown
```

다시 모든 서버들을 실행합니다.
```
src/redis-server 7001/redis.conf
src/redis-server 7002/redis.conf
src/redis-server 7003/redis.conf
src/redis-server 7004/redis.conf
src/redis-server 7005/redis.conf
src/redis-server 7006/redis.conf
src/redis-server 7007/redis.conf
src/redis-server 7008/redis.conf
```

다시 Redis에 접속합니다.
```
src/redis-cli -c -p 7001
```