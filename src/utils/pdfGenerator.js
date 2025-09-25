import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * HTML 요소를 PDF로 변환하여 다운로드
 * @param {HTMLElement} element - PDF로 변환할 HTML 요소
 * @param {string} filename - 다운로드할 파일명
 * @param {Object} options - 추가 옵션
 */
export const generatePDF = async (element, filename = 'resume.pdf', options = {}) => {
  try {
    // 기본 옵션 설정
    const defaultOptions = {
      scale: 2, // 해상도 품질
      useCORS: true, // CORS 이미지 허용
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.offsetWidth,
      height: element.offsetHeight
    }

    const canvasOptions = { ...defaultOptions, ...options.canvas }

    // HTML을 Canvas로 변환
    const canvas = await html2canvas(element, canvasOptions)
    const imgData = canvas.toDataURL('image/png', 1.0)

    // PDF 생성
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      ...options.pdf
    })

    // A4 크기 계산 (mm)
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // 이미지 크기 계산
    const imgWidth = pageWidth - 20 // 좌우 마진 10mm씩
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 10 // 상단 마진

    // 첫 페이지 추가
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
    heightLeft -= pageHeight - 20 // 상하 마진 제외

    // 필요시 추가 페이지 생성
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight - 20
    }

    // PDF 다운로드
    pdf.save(filename)

    return {
      success: true,
      message: 'PDF가 성공적으로 생성되었습니다.'
    }
  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error)
    return {
      success: false,
      message: 'PDF 생성 중 오류가 발생했습니다.',
      error
    }
  }
}

/**
 * 이력서 전용 PDF 생성 함수
 * @param {string} filename - 파일명
 */
export const generateResumePDF = async (filename = '황원희_이력서.pdf') => {
  // 이력서 페이지의 메인 컨테이너 찾기
  const resumeElement = document.querySelector('.resume-content')

  if (!resumeElement) {
    throw new Error('이력서 요소를 찾을 수 없습니다.')
  }

  // 인쇄 스타일 적용을 위한 클래스 추가
  document.body.classList.add('pdf-generating')

  const options = {
    canvas: {
      scale: 3, // 높은 해상도
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 1200, // 고정 폭
      height: resumeElement.scrollHeight
    },
    pdf: {
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    }
  }

  try {
    const result = await generatePDF(resumeElement, filename, options)
    return result
  } finally {
    // 클래스 제거
    document.body.classList.remove('pdf-generating')
  }
}

/**
 * 개발자 소개 페이지 PDF 생성 함수
 * @param {string} filename - 파일명
 */
export const generateAboutPDF = async (filename = '황원희_개발자소개.pdf') => {
  const aboutElement = document.querySelector('.about-page')

  if (!aboutElement) {
    throw new Error('개발자 소개 요소를 찾을 수 없습니다.')
  }

  document.body.classList.add('pdf-generating')

  const options = {
    canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 1200,
      height: aboutElement.scrollHeight
    },
    pdf: {
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    }
  }

  try {
    const result = await generatePDF(aboutElement, filename, options)
    return result
  } finally {
    document.body.classList.remove('pdf-generating')
  }
}