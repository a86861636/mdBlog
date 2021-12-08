'use strict'
const fs = require("fs")
try {
  //读取项目文件目录
  console.log('读取文章目录中')
  let menuArr = []
  let articleDir = './article/'
  fs.readdirSync(articleDir).forEach(file => {
    if (file.indexOf('.') == -1) {
      let obj = {
        title: file,
        articles: []
      }
      fs.readdirSync(articleDir + file).forEach(file1 => {
        if (file1.indexOf('.md') > -1) {
          obj.articles.push(file1.replace('.md', ''))
        }
      })
      menuArr.push(obj)
    }
  })

  //替换article文件夹里的md文件中的图片路径
  console.log('修改图片路径')
  const imageUrl = 'https://raw.githubusercontent.com/a86861636/mdBlog/main/image'
  const imageKey = '../../image'
  for (let item of menuArr) {
    item.articles.forEach(art => {
      console.log(art)
      const artPath = articleDir + item.title + '/' + art + '.md'
      const artFile = fs.readFileSync(artPath)
      const artFileStr = artFile.toString()
      if (artFileStr.indexOf('../../image') > -1) {
        let replaceStr = artFileStr.replace(RegExp('../../image', 'g'), imageUrl)
        fs.writeFileSync(artPath, replaceStr)
      }
    })
  }

  //修改README.md中文章目录
  console.log('修改README.md中')
  const githubUrl = 'https://github.com/a86861636/mdBlog/blob/main/article'
  const mdFile = fs.readFileSync('./README.md')
  const mdFileStr = mdFile.toString()
  let oldMenuStr = mdFileStr.match(`<!-- 目录 start -->([\\s\\S]*?)<!-- 目录 end -->`)[1]
  let newMenuStr = '\n'
  for (let item of menuArr) {
    newMenuStr += '## ' + item.title + '\n'
    let index = 1
    item.articles.forEach(art => {
      newMenuStr += `${index}. [${art}](${githubUrl}/${item.title}/${art}.md)\n`
    })
  }
  fs.writeFileSync('./README.md', mdFileStr.replace(oldMenuStr, newMenuStr))
  console.log('修改完成')

} catch (e) {
  console.log(e)
  console.log('失败')
}