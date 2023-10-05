from config import api


from apis.Auth.views import api as ns_auth
from apis.Project.views import api as ns_project
from apis.LandAcquisition.views import api as ns_land_acquisition
from apis.PhysicalProgress.views import api as ns_physical_progress
from apis.FinancialProgress.views import api as ns_financial_progress

# Register namespaces.
api.add_namespace(ns_auth, path='/0.0.1/Auth')
api.add_namespace(ns_project, path='/0.0.1/Project')
api.add_namespace(ns_land_acquisition, path='/0.0.1/LandAcquisition')
api.add_namespace(ns_physical_progress, path='/0.0.1/PhysicalProgress')
api.add_namespace(ns_financial_progress, path='/0.0.1/FinancialProgress')
