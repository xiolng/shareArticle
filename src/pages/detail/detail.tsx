import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {View, Text, RichText} from '@tarojs/components'
import {AtButton} from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './detail.scss'

export default class Detail extends Component {

  private state = {
    details: {
      adName: '',
      advertisementContent: '',
      advertisementId: ''
    },
    shareDetail: {
      shareDetail: '',
      shareImg: '',
      shareName: '',
      advertisementId: ''
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }
  onLoad(options){
    console.log(33333, options)
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    Taro.request({
      method: "GET",
      url: `https://ad.noster.cn/advertising/advertisement/getAdById`,
      data: {
        advertisementId: getCurrentInstance().router.params.id
      }
    }).then(res => {
      if (res.data.code === '200') {
        this.setState({
          details: res.data.data
        })
        Taro.setNavigationBarTitle({
          title: res.data.data.adName.toString()
        })
      }
    })
    Taro.request({
      method: "GET",
      url: `https://ad.noster.cn/advertising/advertisement/getAdShareInfo`,
      data: {
        advertisementId: getCurrentInstance().router.params.id
      }
    }).then(res => {
      if (res.data.code === '200') {
        this.setState({
          shareDetail: res.data.data
        })
      }
    })
  }

  componentDidShow() {
  }

  onShareAppMessage() {
    const {shareImg, shareName, advertisementId} = this.state.shareDetail
    const data = {
      title: shareName,
      path: '/pages/detail/detail?id=' + advertisementId,
      imageUrl: 'https://ad.noster.cn' + shareImg,
    }
    return data
  }
  onShareTimeline() {
    const {shareImg, shareName, advertisementId} = this.state.shareDetail
    const data = {
      title: shareName,
      path: '/pages/detail/detail?id=' + advertisementId,
      imageUrl: 'https://ad.noster.cn' + shareImg,
    }
    return data
  }

  componentDidHide() {
  }

  render() {
    const {details: {advertisementContent}} = this.state
    return (
      <View className='detail'>
        <RichText
          nodes={
            advertisementContent && advertisementContent
              .replace(/<img/gi, `<img style="width: 100%;max-width: 100% !important;display: block; margin: 0 auto;"`)
              .replace(/">/gi, `" style="width: 100%;max-width: 100% !important;display: block">`)
              .replace(/"\/>/gi, `" style="width: 100%;max-width: 100% !important;display: block">`)
              .replace(/src="/gi, `src="https://ad.noster.cn`)
              .replace(/width="/gi, 'w=')
              .replace(/height=/gi, 'h=')
              .replace(/<section/g, '<div')
              .replace(/\/section>/g, '\/div>')
              .replace(/<p/g, '<div')
              .replace(/\/p>/g, '\/div>')
              .replace(/\/div>/g, ' style="width: 100%; height: auto;" \/div>')
          }
        />
      </View>
    )
  }
}
