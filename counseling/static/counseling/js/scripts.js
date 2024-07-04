document.addEventListener('DOMContentLoaded', function () {
    // 고객 정보 폼
    document.getElementById('customer-form').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveCustomerInfo();
        }
    });

    // 메모 폼
    document.getElementById('memo-form').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveMemo();
        }
    });

    // 문의/조치 내용 폼
    document.getElementById('consultation-form').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveConsultation();
        }
    });
});

function editCustomerInfo() {
    const form = document.getElementById('customer-form');
    const inputs = form.querySelectorAll('input:not([type="button"])');
    inputs.forEach(input => input.disabled = false);

    form.querySelector('.edit-button').style.display = 'none';
    form.querySelectorAll('.save-button, .cancel-button').forEach(button => {
        button.style.display = 'inline-block';
    });
}

function saveCustomerInfo() {
    const form = document.getElementById('customer-form');
    const inputs = form.querySelectorAll('input:not([type="button"])');
    inputs.forEach(input => input.disabled = true);

    // 고객 정보를 저장하는 로직 추가, 예: 서버로 데이터 전송
    // alert('고객 정보가 저장되었습니다.');

    form.querySelector('.edit-button').style.display = 'inline-block';
    form.querySelectorAll('.save-button, .cancel-button').forEach(button => {
        button.style.display = 'none';
    });
}

function cancelEdit() {
    const form = document.getElementById('customer-form');
    const inputs = form.querySelectorAll('input:not([type="button"])');
    inputs.forEach(input => input.disabled = true);

    // 수정 취소를 처리하는 로직 추가, 예: 변경 사항 되돌리기
    // alert('수정이 취소되었습니다.');

    form.querySelector('.edit-button').style.display = 'inline-block';
    form.querySelectorAll('.save-button, .cancel-button').forEach(button => {
        button.style.display = 'none';
    });
}

function editMemo() {
    const textarea = document.getElementById('memo-text');
    textarea.disabled = false;

    document.querySelector('#memo-form .edit-button').style.display = 'none';
    document.querySelectorAll('#memo-form .save-button, #memo-form .cancel-button').forEach(button => {
        button.style.display = 'inline-block';
    });
}

function saveMemo() {
    const textarea = document.getElementById('memo-text');
    textarea.disabled = true;

    // 메모 내용을 저장하는 로직 추가, 예: 서버로 데이터 전송
    // alert('메모가 저장되었습니다.');

    document.querySelector('#memo-form .edit-button').style.display = 'inline-block';
    document.querySelectorAll('#memo-form .save-button, #memo-form .cancel-button').forEach(button => {
        button.style.display = 'none';
    });
}

function cancelMemoEdit() {
    const textarea = document.getElementById('memo-text');
    textarea.disabled = true;

    // 메모 수정 취소를 처리하는 로직 추가, 예: 변경 사항 되돌리기
    // alert('메모 수정이 취소되었습니다.');

    document.querySelector('#memo-form .edit-button').style.display = 'inline-block';
    document.querySelectorAll('#memo-form .save-button, #memo-form .cancel-button').forEach(button => {
        button.style.display = 'none';
    });
}

function editConsultation() {
    const form = document.getElementById('consultation-form');
    const textareas = form.querySelectorAll('textarea');
    textareas.forEach(textarea => textarea.disabled = false);

    document.querySelector('#consultation-form .edit-button').style.display = 'none';
    document.querySelectorAll('#consultation-form .save-button, #consultation-form .cancel-button').forEach(button => {
        button.style.display = 'inline-block';
    });
}

function saveConsultation() {
    const form = document.getElementById('consultation-form');
    const textareas = form.querySelectorAll('textarea');
    textareas.forEach(textarea => textarea.disabled = true);

    // 문의/조치 내용을 저장하는 로직 추가, 예: 서버로 데이터 전송
    // alert('문의/조치 내용이 저장되었습니다.');

    document.querySelector('#consultation-form .edit-button').style.display = 'inline-block';
    document.querySelectorAll('#consultation-form .save-button, #consultation-form .cancel-button').forEach(button => {
        button.style.display = 'none';
    });
}

function cancelConsultationEdit() {
    const form = document.getElementById('consultation-form');
    const textareas = form.querySelectorAll('textarea');
    textareas.forEach(textarea => textarea.disabled = true);

    // 문의/조치 내용 수정 취소를 처리하는 로직 추가, 예: 변경 사항 되돌리기
    // alert('문의/조치 내용 수정이 취소되었습니다.');

    document.querySelector('#consultation-form .edit-button').style.display = 'inline-block';
    document.querySelectorAll('#consultation-form .save-button, #consultation-form .cancel-button').forEach(button => {
        button.style.display = 'none';
    });
}

let mediaRecorder;
let fullAudioChunks = [];
let audioStream;
let interval;

const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const transcription = document.getElementById('transcription');

function startCounseling() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioStream = stream;
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorder.start();

            interval = setInterval(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.requestData();
                }
            }, 10000);  // 10초마다 데이터 요청

            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    // fullAudioChunks에 현재 청크를 추가
                    fullAudioChunks.push(event.data);

                    // 청크 데이터의 길이 로그 출력
                    console.log('Audio chunk size:', event.data.size);

                    // 청크 데이터를 비동기적으로 전송
                    sendAudioChunk(event.data);
                }
            };

            startButton.disabled = true;
            stopButton.disabled = false;
        })
        .catch(error => {
            console.error('Error accessing media devices.', error);
        });
}

function stopCounseling() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }

    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }

    clearInterval(interval);

    const fullAudioBlob = new Blob(fullAudioChunks, { type: 'audio/webm' });
    fullAudioChunks = [];

    const formData = new FormData();
    formData.append('audio', fullAudioBlob);

    fetch('/counseling/stt_chat/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.output) {
                transcription.innerHTML += '<div class="output-msg">Final Output: ' + data.output + '</div>';
            } else if (data.error) {
                transcription.innerHTML += '<div class="error-msg"> Error: ' + data.error + '</div>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            transcription.innerHTML += '<div class="error-msg"> Error: ' + error.message + '</div>';
        });

    startButton.disabled = false;
    stopButton.disabled = true;
}

function sendAudioChunk(chunk) {
    const formData = new FormData();
    formData.append('audio', chunk);

    fetch('/counseling/stt/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.text) {
                transcription.innerHTML += '<div class="input-msg">' + data.text + '</div>';
            } else if (data.error) {
                transcription.innerHTML += '<div class="error-msg"> Error: ' + data.error + '</div>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            transcription.innerHTML += '<div class="error-msg"> Error: ' + error.message + '</div>';
        });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}