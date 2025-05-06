export const PrintReport = ({ cropData }) => {
  const handlePrint = () => {
    if (Platform.OS === 'web') {
      const printContent = `
        <h1>फसल रिपोर्ट</h1>
        <h2>${cropData.name}</h2>
        <div>अनुमानित उपज: ${cropData.expectedYield}</div>
        <div>सिंचाई आवश्यकता: ${cropData.waterNeeds}</div>
        <div>बाज़ार भाव: ₹${cropData.marketPrice}/क्विंटल</div>
      `;
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };
}; 