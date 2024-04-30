import http from 'https'

function checkUrl(imageUrl) {
  http.get(imageUrl, response => {
    console.log(response.statusCode)
  }).on('error', e => {
    console.log(e)
  })
}

checkUrl('https://gchat.qpic.cn/download?appid=1407&fileid=CgoxMzMyNTI0MjIxEhRrdaUgQP5MjweWa4uR8pviUDaGQhjcxQUg_wooiYTj39fphQNQgL2jAQ&spec=0&rkey=CAQSKAB6JWENi5LMk0kc62l8Pm3Jn1dsLZHyRLAnNmHGoZ3y_gDZPqZt-64')
checkUrl('https://multimedia.nt.qq.com.cn/download?appid=1407&fileid=CgoxMzMyNTI0MjIxEhRrdaUgQP5MjweWa4uR8pviUDaGQhjcxQUg_wooiYTj39fphQNQgL2jAQ&spec=0&rkey=CAQSKAB6JWENi5LMk0kc62l8Pm3Jn1dsLZHyRLAnNmHGoZ3y_gDZPqZt-64')
