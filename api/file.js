const Items = [
  {
    fileName: '1.jpg',
    fileType: 'image/jpeg',
    path: require('@/static/bg/1.jpg')
  },
  {
    fileName: '2.jpg',
    fileType: 'image/jpeg',
    path: require('@/static/bg/2.jpg')
  },
  {
    fileName: '3.jpg',
    fileType: 'image/jpeg',
    path: require('@/static/bg/3.jpg')
  }
]

const getFile = (limit) => {
  return (limit) ? Items.slice(0, limit) : Items
}

export { getFile }
