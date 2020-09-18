
function load_releases(id)
{
    let latest_release_name = document.getElementById(id + "-latest-release-name");
    let release_list_div = document.getElementById(id + "-release-list-div");

    fetch('https://api.github.com/repos/skiftOS/skift/releases/latest')
    .then(res => res.json())
    .then((out) => {

        let release = out;

        let release_list_content = ""

        latest_release_name.innerHTML = release["tag_name"];

        for (const keyAsset in release["assets"])
        {
            let icon
            let asset = release["assets"][keyAsset];

            if (asset["name"] == "bootdisk.iso")
            {
                icon = "album"
            }
            else
            {
                icon = "insert-drive-file"
            }

            release_list_content += `<button id="${id}-browserurl" class="accent-button release-button link"><i class="mdi mdi-${icon}"></i>${asset["name"]}</a>`;
            register_link(`${id}-browserurl`, release["browser_download_url"], true);
        }

        release_list_content += `<button id="${id}-tarball" class="accent-button release-button link"><i class="mdi mdi-folder-text"></i>tarball</a>`;
        release_list_content += `<button id="${id}-zip" class="accent-button release-button link"><i class="mdi mdi-folder-text"></i>zip</a>`;
        register_link(`${id}-tarball`, release["tarball_url"], true);
        register_link(`${id}-zip`, release["zipball_url"], true);

        release_list_div.innerHTML += release_list_content

    }).catch(err => latest_release_name.innerHTML = "Failled to fetch releases... sorry :/");
}