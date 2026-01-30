/**
 * Exporter Utility
 * Handles PDF and Image export functionality
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exporter = {
  async exportPDF(element, invoiceData, onLoading = null, onDone = null) {
    try {
      onLoading?.('Generating PDF...');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight);

      const filename = this.generateFilename(invoiceData, 'pdf');
      pdf.save(filename);

      onDone?.();

      return true;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      onDone?.();
      throw error;
    }
  },

  async exportImage(element, invoiceData, format = 'png', onLoading = null, onDone = null) {
    try {
      onLoading?.('Generating Image...');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const filename = this.generateFilename(invoiceData, format);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);

        onDone?.();
      }, `image/${format}`, 1.0);

      return true;
    } catch (error) {
      console.error('Error exporting image:', error);
      onDone?.();
      throw error;
    }
  },

  async generatePDFBlob(element, invoiceData) {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight);

    const filename = this.generateFilename(invoiceData, 'pdf');
    const pdfBlob = pdf.output('blob');
    const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

    return { file: pdfFile, filename };
  },

  generateFilename(invoiceData, extension) {
    const invoiceNumber = invoiceData.invoiceNumber || 'invoice';
    const clientName = invoiceData.invoiceForName || 'client';
    const date = new Date().toISOString().split('T')[0];

    const cleanInvoice = invoiceNumber.replace(/[^a-z0-9]/gi, '_');
    const cleanClient = clientName.replace(/[^a-z0-9]/gi, '_');

    return `${cleanInvoice}_${cleanClient}_${date}.${extension}`;
  },

  async sharePDF(element, invoiceData) {
    try {
      const { file, filename } = await this.generatePDFBlob(element, invoiceData);

      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Invoice ${invoiceData.invoiceNumber}`,
          text: `Invoice for ${invoiceData.invoiceForName} - Total: ${invoiceData.currency} ${invoiceData.total}`
        });
        return { success: true, method: 'native' };
      } else {
        // Fallback: Open share menu with manual options
        return this.openShareMenu(file, invoiceData, filename);
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      throw error;
    }
  },

  openShareMenu(file, invoiceData, filename) {
    return new Promise((resolve) => {
      // Create file URL for sharing
      const fileUrl = URL.createObjectURL(file);

      // Create share options
      const shareOptions = {
        email: {
          name: 'Email',
          icon: '✉️',
          action: () => {
            const subject = encodeURIComponent(`Invoice ${invoiceData.invoiceNumber} - ${invoiceData.invoiceForName}`);
            const body = encodeURIComponent(
              `Dear ${invoiceData.invoiceForName},\n\nPlease find attached invoice ${invoiceData.invoiceNumber}.\n\nTotal: ${invoiceData.currency} ${invoiceData.total}\n\nBest regards`
            );
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
            return { success: true, method: 'email' };
          }
        },
        whatsapp: {
          name: 'WhatsApp',
          icon: '💬',
          action: () => {
            const text = encodeURIComponent(
              `Invoice ${invoiceData.invoiceNumber} for ${invoiceData.invoiceForName}\nTotal: ${invoiceData.currency} ${invoiceData.total}\n\nPlease check your email for the PDF invoice.`
            );
            window.open(`https://wa.me/?text=${text}`, '_blank');
            return { success: true, method: 'whatsapp' };
          }
        },
        telegram: {
          name: 'Telegram',
          icon: '✈️',
          action: () => {
            const text = encodeURIComponent(
              `Invoice ${invoiceData.invoiceNumber} for ${invoiceData.invoiceForName}\nTotal: ${invoiceData.currency} ${invoiceData.total}`
            );
            window.open(`https://t.me/share/url?url=${encodeURIComponent(fileUrl)}&text=${text}`, '_blank');
            return { success: true, method: 'telegram' };
          }
        },
        download: {
          name: 'Download PDF',
          icon: '📥',
          action: () => {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = filename;
            link.click();
            URL.revokeObjectURL(fileUrl);
            return { success: true, method: 'download' };
          }
        }
      };

      resolve({ success: true, method: 'menu', options: shareOptions });
    });
  }
};
