const perPage = 10;
      let totalPages = 0;
      let currentPage = 1;
      let allRepos = [];

      async function fetchGitHubRepos(username) {
        try {
          const response = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100`
          );
          const repos = await response.json();
          totalPages = Math.ceil(repos.length / perPage);
          allRepos = repos;
          return repos;
        } catch (error) {
          console.error(
            `Error fetching GitHub repositories for ${username}:`,
            error
          );
          return [];
        }
      }

      function renderRepoList(repos) {
        const repoListContainer = document.getElementById("repoList");
        repoListContainer.innerHTML = "";

        repos.forEach((repo) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
              <div class="d-flex flex-column">
                <div class="">                
                    <strong>${repo.name}</strong>
                </div>
                <div class="d-flex justify-content-start align-items-center">                
                    <div class="languages btn btn-outline-info mx-1">${
                      repo.language
                    }</div>
                    <div class="languages btn btn-outline-info mx-1">${
                      repo.language
                    }</div>
                    <div class="languages btn btn-outline-info mx-1">${
                      repo.language
                    }</div>
                </div>
              </div>
              <div>${repo.private ? "Private" : "Public"}</div>
            `;
          repoListContainer.appendChild(listItem);
        });
      }

      function renderPagination() {
        const paginationContainer = document.getElementById("pagination");
        paginationContainer.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
          const pageLink = document.createElement("span");
          pageLink.className = "page-link";
          pageLink.textContent = i;
          pageLink.addEventListener("click", () => onPageChange(i));

          if (i === currentPage) {
            pageLink.style.textDecoration = "underline";
            pageLink.style.background = "rgba(0, 107, 107, 0.297)";
          }

          paginationContainer.appendChild(pageLink);
        }
      }

      function onPageChange(page) {
        currentPage = page;
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const reposOnPage = allRepos.slice(startIndex, endIndex);
        renderRepoList(reposOnPage);
        renderPagination();
      }

      function handleSearch() {
        const searchTerm = document
          .getElementById("searchInput")
          .value.toLowerCase()
          .trim();

        if (searchTerm === "") {
          // If search term is empty, reset filteredRepos to show all repos
          filteredRepos = allRepos;

          // Display repositories for the current page
          const startIndex = (currentPage - 1) * perPage;
          const endIndex = startIndex + perPage;
          const reposOnPage = filteredRepos.slice(startIndex, endIndex);
          renderRepoList(reposOnPage);
        } else {
          // Filter repositories based on the search term
          filteredRepos = allRepos.filter((repo) =>
            repo.name.toLowerCase().includes(searchTerm)
          );

          // Display filtered repositories and pagination
          currentPage = 1;
          renderRepoList(filteredRepos);
          renderPagination();
        }
      }

      async function fetchAndRender() {
        const username = "JatinPatil2003"; // Replace with the desired GitHub username
        await fetchGitHubRepos(username);
        onPageChange(currentPage);
      }

      // Initial load
      fetchAndRender();
