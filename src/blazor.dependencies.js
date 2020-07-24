(function() {
    function fileExtension(filename) {
        return filename.split('.').pop();
    }
    
    async function loadDependencies(dependencies) {
        let scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            if (dependencies.includes(script.src)) {
                dependencies = dependencies.filter(e => e !== script.src);
            }
        }
        let links = document.getElementsByTagName('link');
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            if (link['rel'] === 'stylesheet' &&
                dependencies.includes(link.href)) {
                dependencies = dependencies.filter(e => e !== link.href);
            }
        }

        for (let dep of dependencies) {
            const depScriptPromise = new Promise((resolve, reject) => {
                let fileExt = fileExtension(dep)
                if (fileExt === 'js') {
                    const script = document.createElement('script');
                    script.onload = resolve;
                    script.onerror = reject;
                    script.async = true;
                    script.src = dep;
                    document.body.appendChild(script);
                } else if(fileExt === 'css') {
                    const link = document.createElement('link');
                    link.onload = resolve;
                    link.onerror = reject;
                    link.async = true;
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = dep;
                    document.head.appendChild(link);
                } else {
                    throw `Unknown file extension ${fileExt} !!`;
                }
            });
            await depScriptPromise;
        }
    }

    async function main(deps_file) {
        let dependencies = [];
        let response = await fetch(deps_file);
        if (response.status === 200) {
            let deps_json = await response.json();
            for (let dep of deps_json) {
                if (dep['type'] === 'Razor Class Library' ||
                    dep['type'] === 'RCL') {
                    dependencies = dependencies.concat(await main(`_content/${dep['name']}/blazorDeps.json`));
                } else {
                    dependencies.push(dep['url']);
                }
            }
        }
        if (deps_file === 'blazorDeps.json') {
            await loadDependencies(dependencies);
        }
        return dependencies;
    }

    window.blazorDepsPromise = main('blazorDeps.json');
})();