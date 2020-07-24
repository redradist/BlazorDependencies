(function() {
    async function loadDependencies(dependencies) {
        let scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            if (dependencies.includes(script.src)) {
                dependencies = dependencies.filter(e => e !== script.src);
            }
        }

        for (let dep of dependencies) {
            const depScriptPromise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                document.body.appendChild(script);
                script.onload = resolve;
                script.onerror = reject;
                script.async = true;
                script.src = dep;
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
