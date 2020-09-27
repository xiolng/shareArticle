import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtButton, AtList, AtListItem, AtMessage, AtSearchBar} from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './index.scss'

export default class Index extends Component {

  state = {
    list: [],
    searchName: '',
    pages: {
      pageNum: 1,
      pageSize: 20,
      total: 0
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.getList(this.state.pages.pageNum)
  }

  componentDidHide() {
    this.setState({
      list: []
    })
  }

  onReachBottom() {
    const {list, pages} = this.state
    if (list.length >= pages.total) {
      Taro.atMessage({
        type: 'error',
        message: `已加载全部`
      })
      return
    }
    this.setState({
      pages: {...pages, pageNum: pages.pageNum++}
    }, () => {
      this.getList(pages.pageNum)
    })

  }

  getList(pageNum, isSearch?) {
    const {searchName, pages, list} = this.state
    const {total} = pages
    Taro.request({
      method: "POST",
      url: 'https://ad.noster.cn/advertising/advertisement/adList',

      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        adName: searchName,
        ...pages,
        pageNum
      }
    }).then(res => {
      if (res.data.code === '200') {
        const datas = total && (list.length >= total) ? list : [...list, ...res.data.data]
        this.setState({
          list: isSearch ? res.data.data : datas,
          pages: {...pages, total: res.data.total}
        })
      }
    })
  }

  render() {
    const {list, searchName, pages} = this.state
    return (
      <View className='index'>
        <View className='search-box'>
          <AtSearchBar
            value={searchName}
            placeholder='请输入关键字搜索'
            onChange={value => this.setState({searchName: value})}
            onConfirm={() => this.getList(1, 1)}
            onActionClick={() => this.getList(1, 1)}
            onClear={() => this.setState({
              searchName: ''
            }, () => this.getList(1,1))}
            fixed
            showActionButton
          />
        </View>
        <View className="list-box">
          <AtList>
            {
              list && list.map(v => (
                <AtListItem
                  key={v.advertisementId}
                  title={v.adName}
                  arrow='right'
                  onClick={() => Taro.navigateTo({
                    url: `/pages/detail/detail?id=${v.advertisementId}`
                  })}
                />
              ))
            }

          </AtList>
        </View>
        <AtMessage />
      </View>
    )
  }
}
