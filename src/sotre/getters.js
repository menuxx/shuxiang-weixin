
import * as filter from '../filters'
import config from '../config'

export default {

  myConsumeChannelOrderDetails: state => {
    try {
      var {consumeChannelOrderDetails} = state
      var {vChannel} = consumeChannelOrderDetails
      consumeChannelOrderDetails.vChannel.ownerAvatarUrl = filter.cdnFullUrl(vChannel.ownerAvatar, config.QiNiuImagePrefix.vipChannelAvatar)
      consumeChannelOrderDetails.vChannel.item.coverImageUrl = filter.cdnFullUrl(vChannel.item.coverImage, config.QiNiuImagePrefix.item)
      return consumeChannelOrderDetails
    } catch (e) {

    }
  }
}
