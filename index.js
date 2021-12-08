//node.js读取项目文件目录
const fs = require("fs")
try {
  console.log('读取目录中')
  let menuArr = []
  fs.readdirSync('./').forEach(file => {
    if (file.indexOf('.') == -1) {
      let obj = {
        title: file,
        articles: []
      }
      fs.readdirSync('./' + file).forEach(file1 => {
        if (file1.indexOf('.md') > -1) {
          obj.articles.push(file1.replace('.md', ''))
        }
      })
      menuArr.push(obj)
    }
  })
  // console.log(arr)
  console.log('修改README.md')
  const githubUrl = 'https://github.com/a86861636/mdBlog/tree/master'
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