import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, Animated, Platform } from 'react-native';
import { Icon } from '../../components/Icon';
import { useWebAppContext } from '../contexts/WebAppContext';

interface SchemeDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  scheme: any;
}

const SchemeDetailsModal = ({ visible, onClose, scheme }: SchemeDetailsModalProps) => {
  const { language } = useWebAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedValue] = useState(new Animated.Value(0));
  
  useEffect(() => {
    if (visible) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [visible, animatedValue]);
  
  if (!scheme) return null;
  
  // Translated content based on selected language
  const getTranslatedContent = (key, defaultText) => {
    // This would be replaced with actual translations in a real app
    if (language === 'Hindi') {
      const hindiTranslations = {
        'overview': 'अवलोकन',
        'eligibility': 'पात्रता',
        'benefits': 'लाभ',
        'how-to-apply': 'आवेदन कैसे करें',
        'Eligibility': 'पात्रता',
        'Benefits': 'लाभ',
        'Required Documents': 'आवश्यक दस्तावेज',
        'Application Process': 'आवेदन प्रक्रिया',
        'Step 1': 'चरण 1',
        'Step 2': 'चरण 2',
        'Step 3': 'चरण 3',
        'Apply Now': 'अभी आवेदन करें',
        'Close': 'बंद करें',
        'Helpline': 'हेल्पलाइन',
        'Website': 'वेबसाइट',
      };
      return hindiTranslations[key] || defaultText;
    }
    
    return defaultText;
  };
  
  // Mock application process steps
  const applicationSteps = [
    {
      step: getTranslatedContent('Step 1', 'Step 1'),
      description: 'Register on the official portal using your Aadhaar number and mobile number.',
      icon: 'account'
    },
    {
      step: getTranslatedContent('Step 2', 'Step 2'),
      description: 'Fill in the application form and upload the required documents.',
      icon: 'file-document'
    },
    {
      step: getTranslatedContent('Step 3', 'Step 3'),
      description: 'Submit application and track status using your registration ID.',
      icon: 'check-circle'
    }
  ];
  
  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                },
              ],
              opacity: animatedValue,
            }
          ]}
        >
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(scheme.category) }]}>
                <Text style={styles.categoryText}>{getCategoryName(scheme.category)}</Text>
              </View>
              <Text style={styles.modalTitle}>{scheme.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'overview' && styles.activeTab]} 
              onPress={() => setActiveTab('overview')}
            >
              <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
                {getTranslatedContent('overview', 'Overview')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'eligibility' && styles.activeTab]} 
              onPress={() => setActiveTab('eligibility')}
            >
              <Text style={[styles.tabText, activeTab === 'eligibility' && styles.activeTabText]}>
                {getTranslatedContent('eligibility', 'Eligibility')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'benefits' && styles.activeTab]} 
              onPress={() => setActiveTab('benefits')}
            >
              <Text style={[styles.tabText, activeTab === 'benefits' && styles.activeTabText]}>
                {getTranslatedContent('benefits', 'Benefits')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'how-to-apply' && styles.activeTab]} 
              onPress={() => setActiveTab('how-to-apply')}
            >
              <Text style={[styles.tabText, activeTab === 'how-to-apply' && styles.activeTabText]}>
                {getTranslatedContent('how-to-apply', 'How to Apply')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {activeTab === 'overview' && (
              <View style={styles.section}>
                <Text style={styles.description}>{scheme.description}</Text>
                
                <View style={styles.contactGrid}>
                  <View style={styles.contactItem}>
                    <Icon name="phone" size={24} color="#3B82F6" />
                    <View>
                      <Text style={styles.contactLabel}>{getTranslatedContent('Helpline', 'Helpline')}</Text>
                      <Text style={styles.contactValue}>{scheme.contactHelpline}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.contactItem}>
                    <Icon name="web" size={24} color="#3B82F6" />
                    <View>
                      <Text style={styles.contactLabel}>{getTranslatedContent('Website', 'Website')}</Text>
                      <Text style={styles.contactValue}>{scheme.website}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>Success Rate</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '85%' }]} />
                  </View>
                  <Text style={styles.infoText}>85% of eligible applications are approved</Text>
                </View>
              </View>
            )}
            
            {activeTab === 'eligibility' && (
              <View style={styles.section}>
                <View style={styles.eligibilityContainer}>
                  <Icon name="account-check" size={32} color="#10B981" style={styles.sectionIcon} />
                  <Text style={styles.sectionText}>{scheme.eligibility}</Text>
                </View>
                
                <Text style={styles.sectionTitle}>{getTranslatedContent('Required Documents', 'Required Documents')}</Text>
                <View style={styles.documentsList}>
                  {scheme.documentationRequired.split(', ').map((doc, index) => (
                    <View key={index} style={styles.documentItem}>
                      <Icon name="file-document-outline" size={20} color="#6B7280" />
                      <Text style={styles.documentText}>{doc}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {activeTab === 'benefits' && (
              <View style={styles.section}>
                <View style={styles.benefitsContainer}>
                  <Icon name="hand-coin" size={32} color="#F59E0B" style={styles.sectionIcon} />
                  <Text style={styles.sectionText}>{scheme.benefits}</Text>
                </View>
                
                <View style={styles.benefitsBox}>
                  <Text style={styles.benefitsTitle}>Economic Impact</Text>
                  <Text style={styles.benefitsDescription}>
                    Farmers who enrolled in this scheme have reported an average 20% increase in annual income.
                  </Text>
                </View>
                
                <View style={styles.testimonialBox}>
                  <View style={styles.testimonialHeader}>
                    <View style={styles.testimonialAvatar}>
                      <Text style={styles.testimonialInitials}>RS</Text>
                    </View>
                    <View>
                      <Text style={styles.testimonialName}>Ramesh Singh</Text>
                      <Text style={styles.testimonialLocation}>Farmer, Punjab</Text>
                    </View>
                  </View>
                  <Text style={styles.testimonialText}>
                    "This scheme helped me install a micro-irrigation system that reduced my water usage by 40% while increasing yield."
                  </Text>
                </View>
              </View>
            )}
            
            {activeTab === 'how-to-apply' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{getTranslatedContent('Application Process', 'Application Process')}</Text>
                
                <View style={styles.stepsContainer}>
                  {applicationSteps.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                      <View style={styles.stepNumberContainer}>
                        <Icon name={step.icon} size={24} color="white" />
                      </View>
                      <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>{step.step}</Text>
                        <Text style={styles.stepDescription}>{step.description}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>{getTranslatedContent('Apply Now', 'Apply Now')}</Text>
                </TouchableOpacity>
                
                <View style={styles.noteBox}>
                  <Icon name="information" size={20} color="#3B82F6" />
                  <Text style={styles.noteText}>
                    Applications are processed within 30 days. You can check your application status online using your Aadhaar number.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.footerButton} onPress={onClose}>
              <Text style={styles.footerButtonText}>{getTranslatedContent('Close', 'Close')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Helper functions - should match those in the parent component
const getCategoryName = (category) => {
  switch(category) {
    case 'financial': return 'Financial Support';
    case 'insurance': return 'Insurance';
    case 'credit': return 'Credit & Loans';
    case 'education': return 'Education & Training';
    case 'infrastructure': return 'Infrastructure & Equipment';
    default: return category.charAt(0).toUpperCase() + category.slice(1);
  }
};

const getCategoryColor = (category) => {
  switch(category) {
    case 'financial': return '#3B82F6'; // blue
    case 'insurance': return '#10B981'; // green
    case 'credit': return '#F59E0B'; // amber
    case 'education': return '#8B5CF6'; // purple
    case 'infrastructure': return '#EF4444'; // red
    default: return '#6B7280'; // gray
  }
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 700,
    maxHeight: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 16,
  },
  categoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 16,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingVertical: 8,
  },
  contactLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 8,
  },
  infoBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 24,
  },
  sectionIcon: {
    marginRight: 16,
  },
  sectionText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    flex: 1,
  },
  eligibilityContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
  },
  documentsList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  benefitsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 16,
  },
  benefitsBox: {
    marginTop: 24,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 8,
  },
  benefitsDescription: {
    fontSize: 14,
    color: '#065F46',
    lineHeight: 22,
  },
  testimonialBox: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  testimonialInitials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  testimonialName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  testimonialLocation: {
    fontSize: 12,
    color: '#6B7280',
  },
  testimonialText: {
    fontSize: 14,
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  stepsContainer: {
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumberContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  applyButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16,
  },
  noteText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 22,
    flex: 1,
    marginLeft: 12,
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B5563',
  },
});

export default SchemeDetailsModal; 