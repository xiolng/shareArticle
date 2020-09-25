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
      shareName: ''
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

  onShareAppMessage() {
    return {
      title: this.state.shareDetail.shareName,
      path: `/pages/details/details?id=${getCurrentInstance().router.params.id}`,
      imageUrl: 'https://ad.noster.cn' + this.state.shareDetail.shareImg,
    }
  }
  onShareTimeline() {
    return {
      title: this.state.shareDetail.shareName,
      path: `/pages/details/details?id=${getCurrentInstance().router.params.id}`,
      imageUrl: 'https://ad.noster.cn' + this.state.shareDetail.shareImg,
    }
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
              .replace(/<img/gi, `<img style="width: ${Taro.getSystemInfoSync().screenWidth}px;max-width: 100%;display: block"`)
              .replace(/src="/gi, `src="https://ad.noster.cn`)
              .replace(/width="/gi, 'w=')
              .replace(/height=/gi, 'h=')
              .replace(/<section/g, '<div')
              .replace(/\/section>/g, '\div>')
          }
        />
      </View>
    )
  }
}
