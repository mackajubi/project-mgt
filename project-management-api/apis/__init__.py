from config import api


from apis.Auth.views import api as ns_auth
from apis.Workload.views import api as ns_workload
from apis.Dashboard.views import api as ns_dashboard
from apis.Project.views import api as ns_project
from apis.LandAcquisition.views import api as ns_land_acquisition

# Register namespaces.
api.add_namespace(ns_auth, path='/0.0.1/Auth')
api.add_namespace(ns_workload, path='/0.0.1/Workload')
api.add_namespace(ns_dashboard, path='/0.0.1/Dashboard')
api.add_namespace(ns_project, path='/0.0.1/Project')
api.add_namespace(ns_land_acquisition, path='/0.0.1/LandAcquisition')
