import { Share, Platform } from 'react-native';

export const ShareButton = ({ cropInfo }) => {
  const handleShare = async () => {
    if (Platform.OS === 'web') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'फसल जानकारी',
            text: `${cropInfo.name} के लिए सुझाव:\n${cropInfo.tips.join('\n')}`,
            url: window.location.href
          });
        } catch (error) {
          console.log('Error sharing:', error);
        }
      }
    } else {
      await Share.share({
        message: `${cropInfo.name} के लिए सुझाव:\n${cropInfo.tips.join('\n')}`
      });
    }
  };
}; 