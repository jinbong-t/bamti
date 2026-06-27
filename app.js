const USERS = [
  { id: "admin", password: "2026", role: "admin", name: "관리자" },
  { id: "10101", password: "1234", role: "student", studentId: "10101" },
  { id: "10102", password: "1234", role: "student", studentId: "10102" },
  { id: "10103", password: "1234", role: "student", studentId: "10103" },
];

const STUDENTS = [
  {
    id: "10101",
    name: "김코딩",
    photo: "assets/10101_김코딩.jpg",
    grades: {
      "정보 수행평가": "A",
      "웹앱 프로젝트": "92점",
      "디지털 윤리 퀴즈": "88점",
      "수업 참여도": "상",
    },
    traits: [
      "문제 해결 과정을 차분히 설명합니다.",
      "새 도구를 시도할 때 기록을 꼼꼼히 남깁니다.",
      "제출 전 확인 습관을 더 연습하면 좋습니다.",
    ],
    teacherMemo: "프론트엔드 구조 이해가 빠르며, 팀원 질문에 답하는 태도가 좋습니다.",
  },
  {
    id: "10102",
    name: "박개발",
    photo: "assets/10102_박개발.jpg",
    grades: {
      "정보 수행평가": "B+",
      "웹앱 프로젝트": "86점",
      "디지털 윤리 퀴즈": "91점",
      "수업 참여도": "중상",
    },
    traits: [
      "협업 중 역할 분담을 잘 지킵니다.",
      "UI 수정 아이디어를 자주 제안합니다.",
      "프로젝트 범위를 작게 나누는 연습이 필요합니다.",
    ],
    teacherMemo: "기능 구현 의욕이 높고, 오류가 날 때 원인을 함께 추적하려는 태도가 좋습니다.",
  },
  {
    id: "10103",
    name: "이교사",
    photo: "assets/10103_이교사.jpg",
    grades: {
      "정보 수행평가": "A-",
      "웹앱 프로젝트": "89점",
      "디지털 윤리 퀴즈": "95점",
      "수업 참여도": "상",
    },
    traits: [
      "학습 내용을 자기 언어로 정리합니다.",
      "개선할 지점을 발견하면 근거를 함께 제시합니다.",
      "코드 주석을 더 구체적으로 쓰면 좋습니다.",
    ],
    teacherMemo: "질문의 초점이 좋고, 개선 방향을 토의하는 데 적극적입니다.",
  },
];

const loginForm = document.querySelector("#loginForm");
const userIdInput = document.querySelector("#userId");
const passwordInput = document.querySelector("#password");
const loginMessage = document.querySelector("#loginMessage");
const logoutButton = document.querySelector("#logoutButton");
const loginView = document.querySelector("#loginView");
const studentView = document.querySelector("#studentView");
const adminView = document.querySelector("#adminView");

let currentUser = null;

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = userIdInput.value.trim();
  const password = passwordInput.value;
  const user = USERS.find((item) => item.id === id && item.password === password);

  if (!user) {
    loginMessage.textContent = "아이디 또는 비밀번호가 올바르지 않습니다.";
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  currentUser = user;
  loginMessage.textContent = "";
  loginForm.reset();

  if (user.role === "admin") {
    renderAdminDashboard();
  } else {
    const student = STUDENTS.find((item) => item.id === user.studentId);
    renderStudentPage(student);
  }
});

logoutButton.addEventListener("click", () => {
  currentUser = null;
  showOnly(loginView);
  logoutButton.classList.add("hidden");
  userIdInput.focus();
});

function showOnly(targetView) {
  [loginView, studentView, adminView].forEach((view) => view.classList.add("hidden"));
  targetView.classList.remove("hidden");
}

function renderStudentPage(student) {
  if (!student) {
    loginMessage.textContent = "학생 정보를 찾을 수 없습니다.";
    showOnly(loginView);
    return;
  }

  studentView.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <p class="eyebrow">Student</p>
        <h2>${student.name} 학생 페이지</h2>
        <p>로그인한 학생의 학습 현황을 확인합니다.</p>
      </div>
    </div>

    <div class="student-layout">
      <article class="student-profile">
        <img class="student-photo" src="${student.photo}" alt="${student.name} 학생 사진" />
        <div class="profile-body">
          <h3>${student.name}</h3>
          <p class="student-number">학번 ${student.id}</p>
          <div class="tag-row" aria-label="학습 키워드">
            <span class="tag">정보</span>
            <span class="tag">프로젝트</span>
          </div>
        </div>
      </article>

      <div class="content-stack">
        ${renderGrades(student.grades, false, `gradesTitle-${student.id}`)}
        ${renderTraits(student)}
      </div>
    </div>
  `;

  showOnly(studentView);
  logoutButton.classList.remove("hidden");
}

function renderAdminDashboard() {
  adminView.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <p class="eyebrow">Admin</p>
        <h2>관리자 대시보드</h2>
        <p>학생 3명의 학습 현황을 한 화면에서 비교합니다.</p>
      </div>
    </div>

    <section class="admin-grid" aria-label="전체 학생 정보">
      ${STUDENTS.map(renderStudentCard).join("")}
    </section>

    <!-- AI 학생 상담 전략 도우미 패널 -->
    <section id="aiCounselingPanel" class="ai-panel" style="margin-top: 40px; padding: 20px; background: #fff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 2px solid #001eff;">
      <div class="section-title">
        <h3>🤖 AI 학생 상담 전략 도우미</h3>
      </div>
      <div class="ai-panel-content">
        <p class="ai-instruction">위에서 학생 카드의 <strong>[🤖 상담 전략 요청]</strong> 버튼을 클릭하여 학생을 선택하세요.</p>
        <div id="aiTargetStudent" class="hidden">
          <p><strong>선택된 학생:</strong> <span id="aiStudentName"></span> (학번: <span id="aiStudentId"></span>)</p>
          <div class="form-group" style="margin-top: 15px;">
            <label for="teacherConcern" style="display: block; font-weight: bold; margin-bottom: 5px;">교사 상담 고민 입력:</label>
            <textarea id="teacherConcern" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;" placeholder="예: 수업 참여는 좋은데 평가 결과가 낮습니다. 어떻게 상담하면 좋을까요?"></textarea>
          </div>
          <div class="preview-section" style="background: #282c34; color: #abb2bf; padding: 10px; border-radius: 6px; margin: 10px 0; font-family: monospace; font-size: 0.9rem; overflow-x: auto;">
            <h4 style="margin-top: 0;">전송 데이터 미리보기 (익명화)</h4>
            <pre id="dataPreview" style="margin: 0;"></pre>
          </div>
          <button id="requestAiButton" class="primary-button ai-button" style="width:100%; margin-top:10px; background: linear-gradient(90deg, #ff00aa, #001eff);">✨ AI 상담 전략 받기</button>
          
          <div id="aiLoadingMessage" class="hidden" style="margin-top: 15px; color: #ff00aa; font-weight: bold; text-align: center;">
            AI가 상담 전략을 생성하는 중입니다... ⏳
          </div>
          <div id="aiErrorMessage" class="hidden" style="margin-top: 15px; color: red; font-weight: bold; text-align: center;"></div>
          <div id="aiResultArea" class="hidden" style="margin-top: 15px; padding: 15px; background: #f0f8ff; border-radius: 8px; line-height: 1.6;"></div>
        </div>
      </div>
      <p class="ai-disclaimer" style="font-size: 0.9em; color: #666; margin-top: 15px;">
        ※ AI 상담 전략은 참고용입니다. 최종 판단과 실제 상담은 교사가 학생의 상황을 종합적으로 고려하여 진행해야 합니다.
      </p>
    </section>
  `;

  showOnly(adminView);
  logoutButton.classList.remove("hidden");

  const reqBtn = document.getElementById("requestAiButton");
  if(reqBtn) {
    reqBtn.addEventListener("click", handleAiRequest);
  }
}

function renderStudentCard(student) {
  return `
    <article class="student-card">
      <img class="student-photo" src="${student.photo}" alt="${student.name} 학생 사진" />
      <div class="student-card-body">
        <h3>${student.name}</h3>
        <p class="student-number">학번 ${student.id}</p>
        ${renderGrades(student.grades, true, `gradesTitle-${student.id}`)}
        ${renderTraits(student)}
        <button class="primary-button" style="margin-top: 16px; width: 100%;" onclick="selectStudentForAi('${student.id}')">🤖 상담 전략 요청</button>
      </div>
    </article>
  `;
}

function renderGrades(grades, compact = false, headingId = "gradesTitle") {
  const rows = Object.entries(grades)
    .map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`)
    .join("");

  return `
    <section aria-labelledby="${headingId}">
      <div class="section-title">
        <h3 id="${headingId}">성적 정보</h3>
      </div>
      <table class="grade-table ${compact ? "compact-table" : ""}">
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;
}

function renderTraits(student) {
  return `
    <section aria-labelledby="traitsTitle-${student.id}">
      <div class="section-title">
        <h3 id="traitsTitle-${student.id}">학습 특성 및 교사 메모</h3>
      </div>
      <ul class="memo-list">
        ${student.traits.map((trait) => `<li>${trait}</li>`).join("")}
        <li>${student.teacherMemo}</li>
      </ul>
    </section>
  `;
}

let selectedStudentForAi = null;
let anonymizedDataForAi = null;

// window 전역 객체에 연결하여 HTML의 onclick 이벤트에서 접근 가능하게 설정
window.selectStudentForAi = function(studentId) {
  const student = STUDENTS.find(s => s.id === studentId);
  if (!student) return;

  selectedStudentForAi = student;
  
  // 5. Gemini로 전송하는 데이터는 이름, 학번, 사진 경로를 제외한 최소 정보로 제한한다.
  const aliasMap = { "10101": "학생 A", "10102": "학생 B", "10103": "학생 C" };
  const alias = aliasMap[studentId] || "학생 X";
  
  const gradeSummary = Object.entries(student.grades).map(([k, v]) => `${k}: ${v}`).join(", ");
  const learningTraits = student.traits.join(", ");
  
  anonymizedDataForAi = {
    studentAlias: alias,
    gradeSummary: gradeSummary,
    learningTraits: learningTraits,
    teacherConcern: ""
  };

  document.querySelector(".ai-instruction").classList.add("hidden");
  document.querySelector("#aiTargetStudent").classList.remove("hidden");
  
  document.getElementById("aiStudentName").textContent = student.name;
  document.getElementById("aiStudentId").textContent = student.id;
  
  const concernInput = document.getElementById("teacherConcern");
  concernInput.value = "";
  
  document.getElementById("aiResultArea").classList.add("hidden");
  document.getElementById("aiErrorMessage").classList.add("hidden");
  
  updatePreview();
  
  // 텍스트 영역 입력 시 미리보기 업데이트
  concernInput.addEventListener("input", updatePreview);
  
  // 스크롤 이동
  document.getElementById("aiCounselingPanel").scrollIntoView({ behavior: 'smooth' });
}

function updatePreview() {
  if (!anonymizedDataForAi) return;
  anonymizedDataForAi.teacherConcern = document.getElementById("teacherConcern").value;
  document.getElementById("dataPreview").textContent = JSON.stringify(anonymizedDataForAi, null, 2);
}

async function handleAiRequest() {
  const concern = document.getElementById("teacherConcern").value.trim();
  const errorMsg = document.getElementById("aiErrorMessage");
  const resultArea = document.getElementById("aiResultArea");
  const loadingMsg = document.getElementById("aiLoadingMessage");
  
  errorMsg.classList.add("hidden");
  resultArea.classList.add("hidden");
  
  if (!concern) {
    errorMsg.textContent = "상담 고민을 먼저 입력해주세요.";
    errorMsg.classList.remove("hidden");
    return;
  }
  
  loadingMsg.classList.remove("hidden");
  
  try {
    // 1. 프론트엔드에 API 키를 넣으면 개발자 도구에서 노출될 수 있다.
    // 2. Gemini API 호출은 Vercel Serverless Function에서 처리한다.
    const response = await fetch("/api/gemini-counseling", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(anonymizedDataForAi)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // 마크다운 형태를 간단히 HTML로 변환 (엔터 -> <br>)
      resultArea.innerHTML = data.result.replace(/\n/g, '<br>');
      resultArea.classList.remove("hidden");
    } else {
      errorMsg.textContent = data.error || "AI 상담 전략을 불러오지 못했습니다. API 키 또는 Vercel 환경 변수를 확인해주세요.";
      errorMsg.classList.remove("hidden");
    }
  } catch (err) {
    console.error(err);
    errorMsg.textContent = "AI 상담 전략을 불러오지 못했습니다. API 키 또는 Vercel 환경 변수를 확인해주세요.";
    errorMsg.classList.remove("hidden");
  } finally {
    loadingMsg.classList.add("hidden");
  }
}

showOnly(loginView);
